import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getProfiles, resetFollows } from '../../features/profile/profileSlice';
import { Modal, Image, FollowToggle } from '../';

const Following = ({label, classList}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [offset, setOffset] = useState(0);
    const { profile, follows, isFollowLoading } = useSelector((state) => state.profile);
    const dispatch = useDispatch();


    const loadMore = () => {
        if(label === 'Following') {
            if(offset < profile.following.length) {
                const data = `uId=${profile.following.slice(offset, offset + 10).map(item => item).join(',')}`;
                dispatch(getProfiles(data)).then(() => {
                    setOffset(offset + 10);
                });
            }
        } else if (label === 'Followers') {
            if(offset < profile.followers.length) {
                const data = `uId=${profile.followers.slice(offset, offset + 10).map(item => item).join(',')}`;
                dispatch(getProfiles(data)).then(() => {
                    setOffset(offset + 10);
                });
            }
        }
    }


    useEffect(() => {
        if(isOpen) {
            loadMore();
        } else if ( !isOpen && follows.length > 0 ) {
            setOffset(0);
            dispatch(resetFollows());
        }
    }, [isOpen]);

    return (
        <>
            <Modal
                modalIsOpen={isOpen}
                setModalIsOpen={setIsOpen}
                contentLabel={label}
                isLoading={isFollowLoading}
                notCloseOnUpdate={true}
                isScroll={true}
            >
                <div className="follows-list">
                    {follows.map((follow) => (
                        <div className="flex align-between align-center mb-1 flex-align-center" key={follow._id}>
                            <div className="flex flex-align-center">
                                <Link to={`/${follow.username}`}>
                                    {follow.avatar ? (
                                        <Image
                                            image={follow.avatar}
                                            alt="Avatar"
                                            classList="profile-image-md"
                                        /> 
                                    ) : (
                                        <div className="profile-image-placeholder profile-image-placeholder-md">
                                            {follow.username[0].toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                                <div>
                                    <Link 
                                        to={`/${follow.username}`}
                                        className="title-4 text-hover"
                                    >
                                        {follow.username}
                                    </Link>
                                    {follow.fullName && (
                                        <p className="text-secondary mx-3">
                                            {follow.fullName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <FollowToggle
                                profile={follow}
                                isList={true}
                            />
                        </div>
                    ))}
                    {!isFollowLoading && (
                        <div className="text-center mb-1">
                            {label === 'Following' && profile.following.length === 0 ? (
                                `${profile.username} is not following anyone`
                            ) : label === 'Followers' && profile.followers.length === 0 && (
                                `${profile.username} is not being followed`
                            )}
                        </div>
                    )}
                </div>
            </Modal>
            <div 
                className={`btn btn-xs${classList ? ' ' + classList : ''}`}
                onClick={() => setIsOpen(true)}
            >
            {label === 'Following' ? (
                `Following - ${profile.following.length}`
            ) : label === 'Followers' && (
                `Followers - ${profile.followers.length}`
            )}
            </div>
        </>
    )
}

export default Following