import React from "react";
import { Droppable } from "react-beautiful-dnd";
import RootRef from "@material-ui/core/RootRef";
import List from "@material-ui/core/List";
import ListItemCustom from "./ListItemCustom";
import Typography from "@material-ui/core/Typography";

const Column = ({ column }) => {
    return (
        <div
            style={{
                backgroundColor: "gray",
                margin: 10,
                padding: 20,
                color: "white",
            }}
        >
            <Typography variant={"h4"}>{column.id}</Typography>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <RootRef rootRef={provided.innerRef}>
                        <List>
                            {column.list.map((itemObject, index) => {
                                return (
                                    <ListItemCustom
                                        index={index}
                                        itemObject={itemObject}
                                    />
                                );
                            })}
                            {provided.placeholder}
                        </List>
                    </RootRef>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
