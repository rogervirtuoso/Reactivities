import React from 'react';
import "cropperjs/dist/cropper.css";
import {Cropper} from 'react-cropper';

interface IProps {
    imagePreview: string;
    setCropper: (cropper: Cropper) => void;
}

export default function PhotoWidgetCropper({imagePreview, setCropper}: IProps) {
    return (
        <Cropper
            src={imagePreview}
            style={{height: 200, width: '100%'}}
            // @ts-ignore
            initialAspectRatio={1}
            aspectRatio={1}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            onInitialized={cropper => setCropper(cropper)}
        />
    );
}
;
