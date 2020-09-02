import React from 'react';

import './PlaceList.css'
import PlaceItem from "./PlaceItem";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

class PlaceList extends React.Component {
    render() {
        if (this.props.items.length === 0) {
            return (
                <div className={"place-list center"}>
                    <Card>
                        <h2>No places fount. Maybe create one?</h2>
                        <Button className={"background-color-theme"} variant={"contained"} color={"secondary"} style={{marginBottom: "1rem"}}>Share Place</Button>
                    </Card>
                </div>
            );
        }
        return (
            <ul className={'place-list'}>
                {this.props.items.map(place => <PlaceItem key={place.id} id={place.id} image={place.image}
                                                          title={place.title} description={place.description}
                                                          address={place.address} creatorId={place.creator}
                                                          coordinates={place.location} onDelete={place.onDeletePlace}/>)}
            </ul>
        );
    }
}

export default PlaceList;