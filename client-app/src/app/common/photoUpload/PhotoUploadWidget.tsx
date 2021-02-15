import React, {Fragment, useEffect, useState} from 'react';
import {Button, Grid, Header} from 'semantic-ui-react';
import {observer} from 'mobx-react-lite';
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface IProps {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
    setAddPhotoMode: (addPhotoMode: boolean) => void;
}

export const PhotoUploadWidget = ({loading, uploadPhoto, setAddPhotoMode}: IProps) => {
    const [files, setFiles] = useState<any[]>([]);
    const [cropper, setCropper] = useState<Cropper>();

    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => {
                if (blob) {
                    uploadPhoto(blob);
                    setFiles([]);
                    setAddPhotoMode(false);
                }
            });
        }
    }

    return (
        <Fragment>
            <Grid>
                <Grid.Row/>
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 1 - Add Photo'/>
                    <PhotoWidgetDropzone setFiles={setFiles}/>
                </Grid.Column>
                <Grid.Column width={1}/>
                <Grid.Column width={4}>
                    <Header sub color='teal' content='Step 2 - Resize image'/>
                    {files.length > 0 &&
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview}/>}
                </Grid.Column>
                <Grid.Column width={1}/>
                <Grid.Column width={4}>
                    <Header sub color='teal' content='Step 3 - Preview & Upload'/>
                    {files && files.length > 0 &&
                    <>
                        <div className='img-preview' style={{minHeight: 200, overflow: 'hidden'}}/>
                        <Button.Group>
                            <Button onClick={onCrop} positive icon={'check'} loading={loading}/>
                            <Button onClick={() => setFiles([])} icon={'close'}/>
                        </Button.Group>
                    </>}
                </Grid.Column>
            </Grid>
        </Fragment>
    )
};

export default observer(PhotoUploadWidget);