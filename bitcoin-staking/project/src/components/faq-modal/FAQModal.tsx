import { GetProfile } from "@/api/profile";
import GetCookie from '@/hooks/cookies/getCookie';
import { GetrecentFlickers } from "@/api/recent-flickers";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FC, useState, useEffect } from "react";
import Modal from "../modal/modal";
import RecentFlickersTable from "../recent-flickers-table/recentFlickerTable";
import BadgeModal from "../badge-modal/badge-modal";
import { create } from "domain";
import { profile } from "console";

interface FaqModalProps {
	show: boolean;
  handleModal: () => void;
}

const FaqModal:FC<FaqModalProps> = ({ show, handleModal }) => {
  return(
		<Modal customClass={'faq-modal'} show={show} handleModal={handleModal}>
			<div className="faq">
				<div className="close">
					<img src="/static/svgs/close.svg" onClick={handleModal}/>
				</div>
				<div className="faq-title text-yellow title">
					FAQ
				</div>
				<div className="content">
					<div className="item">
						<div className="text-yellow">
						  What is Tug the Nugz and how do I play?
						</div>
						<div className="text-white">
						  Tug the nugz is a fun flip the coin game, where you can try to guess the outcome of a truly random coinflip powered by bitcoin. It is a stateless and trustless game that relies on a commit reveal scheme secure by user signatures to ensure fairness.

						</div>
						<div className="separator" />
					</div>
					<div className="item">
						<div className="text-yellow">
						  How do I win, and what are the associated fees?
						</div>
						<div className="text-white">
							You win the game by correctly predictiong the outcome of the coinflip, we charge 3% per flip irrespective of winning or losing. For example, flipping 1 ΛRC will cost a total of 1.03 ΛRC.
						</div>
						<div className="separator" />
					</div>
					<div className="item">
						<div className="text-yellow">
						  What is ΛRC and how is it related to Bitcoin?
						</div>
						<div className="text-white">
							ΛRC is a BRC20 token, this is similar to the well know ERC20 but hosted directly on the bitcoin blockchain instead of ethereum if you wanto to learn more checkout <a>brc20 standard</a>
						</div>
						<div className="separator" />
					</div>
					<div className="item">
						<div className="text-yellow">
						  How can I ensure that Tug the Nugz is fair
						</div>
						<div className="text-white">
							Tug the Nugz provides a trustless verification script stored in ordinal # that ensures the game was played fairly.
							The game starts by receieving a random number plus a secret nonce hashed together as well as a game nonce. 
							The user then signs the hash and the game nonce. 
						</div>
						<div className="separator" />
					</div>
					<div className="item">
						<div className="text-yellow">
							How can I track my stats, manage referrals, and connect my wallet, including deposit requirements?						</div>
						<div className="text-white">
							You will need to use a bitcoin wallet, we support unisat, xverse, and leather wallet, once you have downlaoded the wallet you can click the start button. chose the account you want to sign up with and sign a message with the public key associated with that account.
							At that point you will have created an account as well as have access to all your stats through the menu, and the deposits through the deposit menu.  
						</div>
						<div className="separator" />
					</div>
					<div className="item">
						<div className="text-yellow">
						  What is Irezumi, and how can I benefit without winning?
						</div>
						<div className="text-white">
							Great question
						</div>
						<div className="separator" />
					</div>
					<div className="item">
						<div className="text-yellow">
						  What are experience points, badges, and how do they affect my ranking?
						</div>
						<div className="text-white">
							the more points the higher your ranking. the more badges themore points you can get
						</div>
					</div>
				</div>
			</div>
		</Modal>
  )
}

export default FaqModal;