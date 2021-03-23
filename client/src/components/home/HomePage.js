import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context/loginContext';
import { getAllFilesFromDB, uploadFileToDB } from '../../server/db/user';
import File from '../main/File';
import Header from '../main/Header';

const HomePage = () => {
    const { userDataState } = useContext(LoginContext);

    const [uploadErrMsg, setUploadErrMsg] = useState('');
    const [isFileInputEmpty, setIisFileInputEmpty] = useState(true);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (!!userDataState.user) {
            getAllFilesFromDB(userDataState.token)
            .then((res) => {
                console.log(res)
                setFiles([...res]);
            })
            .catch((err) => {
            });
        }
    }, [userDataState.user]);

    const uploadFileOnSubmit = (e) => {
        e.preventDefault();
        setUploadErrMsg('');

        let fd = new FormData(e.target);

        uploadFileToDB(fd, userDataState.token)
        .then((res) => {
            setFiles([ ...files, res ]);
        })
        .catch((err) => {
            setUploadErrMsg(err.message);
        });
    }

    const changeFileInputState = (e) => {
        (e.target.files.length === 1) ? setIisFileInputEmpty(false) : setIisFileInputEmpty(true);
    }

    return (
        <>
            <Header />

            <div className="home-page">
                {
                    !!userDataState.user &&
                    <>
                        <form className="file-upload-form" onSubmit={uploadFileOnSubmit}>
                            <label>Upload file:</label>
                            <input onChange={changeFileInputState} type="file" name="file" accept="image/*, .pdf, text/plain"></input>
                            <br></br><button type="submit" disabled={isFileInputEmpty}>Upload</button>
                            { uploadErrMsg !== '' && <span>{uploadErrMsg}</span> }
                        </form>
                        
                        <div className="files-container">
                        {
                            files.map((file, index) => {
                                return <File
                                    index={index}
                                    files={files}
                                    setFiles={setFiles}
                                    key={file.key}
                                    file={file}
                                    token={userDataState.token}
                                />
                            })
                        }
                        </div>
                    </>
                }
            </div>
        </>
    )
};

export default HomePage;