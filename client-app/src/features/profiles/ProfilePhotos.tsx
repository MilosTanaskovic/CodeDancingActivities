import { observer } from 'mobx-react-lite'
import React, {SyntheticEvent, useState} from 'react'
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';
import { Photo, Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}
export default observer(function ProfilePhotos({profile}: Props) {
    const {profileStore: {isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto}} = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    const handlePhotoUpload = (file: Blob) => {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    const handleSetMainPhoto = (photo: Photo, event: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(event.currentTarget.name);
        setMainPhoto(photo);
    }

    const handleDeletePhoto = (photo: Photo, event: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(event.currentTarget.name);
        deletePhoto(photo);
    }
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button 
                            floated='right' 
                            basic 
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'} 
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading}  />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo => (
                                <Card>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button
                                                basic
                                                color='green'
                                                content='Main'
                                                name={'main' + photo.id}
                                                disabled={photo.isMain}
                                                loading={target === 'main' + photo.id && loading}
                                                onClick={(event) => handleSetMainPhoto(photo, event)}
                                            />
                                            <Button 
                                                basic 
                                                color='red' 
                                                icon='trash'
                                                loading={target === photo.id && loading}
                                                onClick={(event) => handleDeletePhoto(photo, event)}
                                                disabled={photo.isMain}
                                                name={photo.id}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
});
