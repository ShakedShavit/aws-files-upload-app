import React, { useState } from 'react';
import { deleteFileFromDB } from '../../server/db/user';
import Modal from './Modal';

const File = (props) => {
    const [isShowingFileName, setIsShowingFileName] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const URL = 'http://localhost:5000/get-file/';
    const file = props.file;
    const fileNameSplitArr = file.originalName.split('.');
    const isFileImage = file.type.includes('image');

    const deleteFileOnClick = () => {
        deleteFileFromDB(file.key, file._id, props.token)
        .then((res) => {
            setIsDeleteModalOpen(false);
            console.log(res);

            const tempFilesArr = [...props.files];
            tempFilesArr.splice(props.index, 1);
            props.setFiles([...tempFilesArr]);
        })
        .catch((err) => {
            setIsDeleteModalOpen(false);
            console.log(err);
        })
    }

    return (
        <div className="file-wrapper">
            {
                isFileImage ?
                <img src={URL + `?key=${file.key}&name=${file.originalName}&token=${props.token}`} alt={file.originalName} onMouseEnter={() => {setIsShowingFileName(true)}} onMouseLeave={() => {setIsShowingFileName(false)}}></img> :
                <embed type="text/ application/pdf" src={URL + `?key=${file.key}&name=${file.originalName}&token=${props.token}`} onMouseEnter={() => {setIsShowingFileName(true)}} onMouseLeave={() => {setIsShowingFileName(false)}}></embed>
            }

            <div className="file-description-line">
                <span className="file-name">{ fileNameSplitArr[0] }</span>
                <span className="file-type">{ fileNameSplitArr[1] }</span>
            </div>

            <button className="delete-file-button" onClick={() => {setIsDeleteModalOpen(true)}}>Delete</button>

            <a className="file-link" href={URL + `?key=${file.key}&name=${file.originalName}&token=${props.token}&download=${true}`}>
                <span>Download</span>
            </a>

            { isShowingFileName && <span className="file-full-name">{file.originalName}</span> }

            {
                isDeleteModalOpen &&
                <Modal
                    setIsModalOpen={setIsDeleteModalOpen}
                    mainText={'Are you sure you want to permanently delete this file?'}
                    confirmFunc={deleteFileOnClick}
                    switchButtonsDesign={true}
                />
            }
        </div>
    )
};

export default File;