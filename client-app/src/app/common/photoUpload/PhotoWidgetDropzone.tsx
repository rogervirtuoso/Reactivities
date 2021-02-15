import React, {FC, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {Header, Icon} from "semantic-ui-react";

interface IProps {
    setFiles: (files: object[]) => void;
}

const dropZoneStyles = {
    border: 'dashed 3px',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',
    height: '200px'
}

const dropZoneActive = {
    borderColor: 'green'
}

const PhotoWidgetDropzone: FC<IProps> = ({setFiles}) => {
    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles.map((file: object) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()} style={isDragActive ? {...dropZoneStyles, ...dropZoneActive} : dropZoneStyles}>
            <input {...getInputProps()} />
            <Icon name={'upload'} size={"huge"}/>
            <Header content={'Drop image here'}/>
        </div>
    )
}

export default PhotoWidgetDropzone;