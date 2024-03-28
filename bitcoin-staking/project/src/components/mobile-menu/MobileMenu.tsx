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

interface MobileMenuProps {
	show: boolean;
	isLoggedin: boolean;
  	handleModal: () => void;
	handleFaqModal: () => void;
	playButtonAudio: () => void;
	handleDepositModal: () => void;
	handleProfileModal: () => void;
	logout: () => void;
}

const MobileMenu:FC<MobileMenuProps> = ({ 
	show, 
	handleModal, 
	isLoggedin,
	handleFaqModal,
	playButtonAudio,
	handleDepositModal,
	handleProfileModal,
	logout,
}) => {
  return(
		<Modal customClass={'mobile-menu-modal'} show={show} handleModal={handleModal}>
			<div className="mobile-menu">
				<div className="close">
					<img src="/static/svgs/close.svg" onClick={handleModal}/>
				</div>
				<div className="content">
					{
						isLoggedin && <>
						<div className="item">
							<div 
								className="text-white"
								onClick={() => {
									handleModal();
									playButtonAudio();
									handleDepositModal();
								}}
							>
								Deposit
							</div>
							<div className="separator" />
						</div>
						<div className="item">
							<div 	
								className="text-white"
								onClick={() => {
									handleModal();
									playButtonAudio();
								}}
							>
								Gift
							</div>
							<div className="separator" />
						</div>
						<div className="item">
							<div 
								className="text-white"
								onClick={() => {
									handleModal();
									playButtonAudio();
									handleProfileModal();
								}}
							>
								Profile
							</div>
							<div className="separator" />
						</div>
						</>
					}
					<div className="item">
						<div className="text-white" onClick={() => {
							handleModal();
							handleFaqModal();
						}}>
						  FAQ
						</div>
						<div className="separator" />
					</div>
					{
						isLoggedin && 
						<div className="item">
							<div 
								className="text-white"
								onClick={() => {
									handleModal();
									logout();
								}}
							>
								Logout
							</div>
						</div>
					}
				</div>
			</div>
		</Modal>
  )
}

export default MobileMenu;