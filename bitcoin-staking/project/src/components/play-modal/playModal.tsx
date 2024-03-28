"use client";

import { setUserName } from '@/api/user';
import { useGlobalContext } from "@/app/react-query-provider/reactQueryProvider";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { FC, useState } from "react";
import Modal from "../modal/modal";
import { handleLeather } from "./leather";
import { handleUnisat } from "./unisat";
import { handleXverse } from './xverse';
import UsernameModal from "../username-modal/usernameModal";
import { playButtonAudio } from '@/sound';

interface PlayModalProps {
	show: boolean;
	handleModal: () => void;
}

Object.defineProperty(global, "_bitcore", {
	get() {
		return undefined;
	},
	set() { },
});

const PlayModal: FC<PlayModalProps> = ({ show, handleModal }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [user_id, setUserId] = useState(0);
	const { isLoggedin, setIsLoggedIn } = useGlobalContext();
	const[showUsernameModal, setShowUsernameModal] = useState(false);

	const handleUsernameModal = () => {
		setShowUsernameModal(!showUsernameModal);
	}

	const handleUserName = async (value: any) => {
		let res = await setUserName(value, user_id);

		if(res?.status == 200 && res?.data.data == "OK") {
			handleUsernameModal();
			router.push('/flip-coin');
			setIsLoggedIn(true);
			enqueueSnackbar('Logged In', {variant: 'success', anchorOrigin: {horizontal: 'left', vertical: 'top'}})
		}
	}

	return (
		<>
			<Modal customClass={'play-modal'} show={show} handleModal={handleModal}>
				<h1 className="modal__heading text-center">Connect your <br />wallet to play</h1>
				<p className="modal__text text-center">
					If you dont have a wallet, you can select a <br /> provider 
					and create one now
				</p>
				<div className="modal__btn-wrapper">
					<button disabled={loading} className="btn-secondary" onClick={async () => {
						playButtonAudio();
						setLoading(true);
						const {
							// @ts-ignore
							flag,
							// @ts-ignore
							payload: {
								newUser = false,
								userId, 
							}
						} = await handleLeather();
						if (flag) {
							// router.push('/flip-coin');
							// setIsLoggedIn(true);
							setLoading(false);
							setUserId(userId);
							if(newUser) {
								handleUsernameModal();
							} else {
								router.push('/flip-coin');
								setIsLoggedIn(true);
								enqueueSnackbar('Logged In', {variant: 'success', anchorOrigin: {horizontal: 'left', vertical: 'top'}})
							}
						} else {
							setLoading(false);
						}
					}}>
						<img src="/static/img/leather-icon.png" alt="leather-icon" /><span>Leather</span>
					</button>
					<button disabled={loading} className="btn-secondary" onClick={async () => {
						playButtonAudio();
						setLoading(true);
						const {
							// @ts-ignore
							flag,
							// @ts-ignore
							payload: {
								newUser = false,
								userId,
							}
						} = await handleUnisat();
						
						if (flag) {
							setLoading(false);
							setUserId(userId);
							if(newUser) {
								handleUsernameModal();
							} else {
								router.push('/flip-coin');
								setIsLoggedIn(true);
								enqueueSnackbar('Logged In', {variant: 'success', anchorOrigin: {horizontal: 'left', vertical: 'top'}})
							}
						} else {
							setLoading(false);
						}
					}}>
						<img src="/static/img/unisat-icon.png" alt="unisat-icon" /><span>UniSat</span>
					</button>
					<button disabled={loading} className="btn-secondary" onClick={async () => {
						playButtonAudio();
						setLoading(true);
						const {
							// @ts-ignore
							flag,
							// @ts-ignore
							payload: {
								newUser = false,
								userId,
							}
						} = await handleXverse();
						if (flag) {
							setLoading(false);
							setUserId(userId);
							if(newUser) {
								handleUsernameModal();
							} else {
								router.push('/flip-coin');
								setIsLoggedIn(true);
								enqueueSnackbar('Logged In', {variant: 'success', anchorOrigin: {horizontal: 'left', vertical: 'top'}})
							}
						} else {
							setLoading(false);
						}
					}}>
						<img src="/static/img/xverse-icon.png" alt="xverse-icon" /><span>Xverse</span>
					</button>
				</div>
			</Modal>
			<UsernameModal show={showUsernameModal} handleModal={handleUsernameModal} handleUserName={handleUserName}/>
		</>
	)
}

export default PlayModal;