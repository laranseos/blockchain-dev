import { useQuery } from "@tanstack/react-query";
import {updateState, getPastVerification, verifyData} from '@/api/verify';
import { FC, useState, useEffect } from "react";
import GetCookie from "@/hooks/cookies/getCookie";
import { enqueueSnackbar } from "notistack";
import Modal from "../modal/modal";
import { playButtonAudio } from "@/sound";

interface VerifyModalProps {
	userId: Number,
	gameNonce: string,
	verified: boolean,
	show: boolean;
	verificationDateTime: string,
  	handleModal: () => void;
	updateBadge: (_gameNonce: string) => void;
}


const VerifyModal:FC<VerifyModalProps> = ({ show, handleModal, userId, gameNonce, verified, updateBadge, verificationDateTime }) => {
	const [result, setResult] = useState("");
	const [loading, setLoading] = useState(false);
	const verification_datetime = "34353534";
	const updateVerification = async () => {
		setLoading(true);
		if(!verified) {
			const pastVerification = await getPastVerification(userId, gameNonce);
			let {
				commitment,
				reveal,
				selection,
				// @ts-ignore
			} = pastVerification.data.data;
			console.log(commitment)
			console.log(selection)
			console.log(reveal)

			commitment = JSON.parse(commitment);
			reveal = JSON.parse(reveal);
			selection = JSON.parse(selection);
			console.log
			const est = await verifyData(commitment, selection, reveal);
			console.log('@@@', commitment, selection, reveal)
			if(est == true) {
				const result = await updateState(userId, gameNonce, est);
				// @ts-ignore
				if(result.status == 200) {
					setResult("Verified");
					updateBadge(gameNonce);
				}
			} else {
				setResult("Failed");
			}
		}
		setLoading(false);
	}

	useEffect(() => {
		setResult("");
	}, [show])

  	return(
		<Modal customClass={'verify-modal'} show={show} handleModal={handleModal}>
			<div className="verify">
				{
					!verified &&
					<>
						<div className="title">
							would you like to verify this game?
						</div>
						{
							loading ? <div className="verify-result">Loading...</div> : (
								result != "" ? <div className="verify-result">{result}</div> :
								<div className="content">
									<button 
										className="btn-outline"
										onClick={() => {
											updateVerification();
										}}
									>
										Yes
									</button>
									<button 
										className="btn-outline"
										onClick={() => {
											handleModal();
										}}
									>
										No
									</button>
								</div>)}
					</>
				}
				{
					verified &&
					<>
						<div className="content-v">
							<img src="/static/svgs/check_active.svg" />
							<span>{gameNonce}</span> verified at <span>{verificationDateTime}</span>
						</div>
					</>
				}
			</div>
		</Modal>
  )
}

export default VerifyModal;