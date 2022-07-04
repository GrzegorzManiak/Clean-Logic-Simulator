import Konva from 'konva';
import PlaceableObject from '../../placeableObject/main';

function moveObjects(objects: Array<PlaceableObject>) {
    if(objects.length < 1) return;

    objects.forEach((object) => {
        object.setDragChildren(objects)
        object.dragEndHooks = [ object.resetDragSelection ];
    });
}

export default moveObjects;