import React, {useEffect, useState} from 'react';

import './ImageUpload.css';
import Button from "@material-ui/core/Button";
import {Input} from "@material-ui/core";
import {CloudUpload} from "@material-ui/icons";

function ImageUpload(props) {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            fileIsValid = true;
        } else {
            fileIsValid = false;
        }
        props.form.setFieldValue(props.field.name, pickedFile, fileIsValid);
    };

    return (
        <div className="form-control">
            <Input
                id={props.field.name}
                name={"image"}
                style={{display: 'none'}}
                type="file"
                accept="image/*"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview"/>}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <label htmlFor={props.field.name}>
                    <Button variant={"contained"} color={"secondary"} component={"span"} startIcon={<CloudUpload />}>
                        PICK IMAGE
                    </Button>
                </label>
            </div>
            {props.isError && <p color={"red"}>{props.errorMessage}</p>}
        </div>
    );
}

export default ImageUpload;
