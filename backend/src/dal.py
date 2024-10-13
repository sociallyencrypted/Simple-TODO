from uuid import uuid4
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ReturnDocument
from pydantic import BaseModel


class ListSummary(BaseModel):
    id: str
    name: str
    item_count: int

    @staticmethod
    def from_document(document: dict) -> "ListSummary":
        return ListSummary(
            id=str(document["_id"]),
            name=document["name"],
            item_count=document["item_count"],
        )


class ToDoListItem(BaseModel):
    id: str
    label: str
    checked: bool

    @staticmethod
    def from_document(item: dict) -> "ToDoListItem":
        return ToDoListItem(
            id=item["id"],
            label=item["label"],
            checked=item["checked"],
        )


class ToDoList(BaseModel):
    id: str
    name: str
    items: list[ToDoListItem]

    @staticmethod
    def from_document(document: dict) -> "ToDoList":
        return ToDoList(
            id=str(document["_id"]),
            name=document["name"],
            items=[ToDoListItem.from_document(item) for item in document["items"]],
        )


class ToDoDAL:
    def __init__(self, todo_collection: AsyncIOMotorCollection):
        self._todo_collection = todo_collection

    async def list_todo_lists(self, session=None):
        async for document in self._todo_collection.find(
            {},
            projection={
                "name": 1,
                "item_count": {"$size": "$items"},
            },
            sort={"name": 1},
            session=session,
        ):
            yield ListSummary.from_document(document)

    async def create_todo_list(self, name: str, session=None) -> str:
        result = await self._todo_collection.insert_one(
            {"name": name, "items": []},
            session=session,
        )
        return str(result.inserted_id)

    async def get_todo_list(self, list_id: str | ObjectId, session=None) -> ToDoList:
        document = await self._todo_collection.find_one(
            {"_id": ObjectId(list_id)},
            session=session,
        )
        return ToDoList.from_document(document)

    async def delete_todo_list(self, list_id: str | ObjectId, session=None) -> bool:
        result = await self._todo_collection.delete_one(
            {"_id": ObjectId(list_id)},
            session=session,
        )
        return result.deleted_count == 1

    async def create_item(
        self,
        list_id: str | ObjectId,
        label: str,
        session=None,
    ) -> ToDoList | None:
        result = await self._todo_collection.find_one_and_update(
            {"_id": ObjectId(list_id)},
            {
                "$push": {
                    "items": {
                        "id": uuid4().hex,
                        "label": label,
                        "checked": False,
                    }
                }
            },
            session=session,
            return_document=ReturnDocument.AFTER,
        )
        return ToDoList.from_document(result) if result else None

    async def set_checked_state(
        self,
        list_id: str | ObjectId,
        item_id: str,
        checked_state: bool,
        session=None,
    ) -> ToDoList | None:
        result = await self._todo_collection.find_one_and_update(
            {"_id": ObjectId(list_id), "items.id": item_id},
            {"$set": {"items.$.checked": checked_state}},
            session=session,
            return_document=ReturnDocument.AFTER,
        )
        return ToDoList.from_document(result) if result else None

    async def delete_item(
        self,
        list_id: str | ObjectId,
        item_id: str,
        session=None,
    ) -> ToDoList | None:
        result = await self._todo_collection.find_one_and_update(
            {"_id": ObjectId(list_id)},
            {"$pull": {"items": {"id": item_id}}},
            session=session,
            return_document=ReturnDocument.AFTER,
        )
        return ToDoList.from_document(result) if result else None