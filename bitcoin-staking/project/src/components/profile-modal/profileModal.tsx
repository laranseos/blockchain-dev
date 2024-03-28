// @ts-nocheck
import { setUserName } from '@/api/user';
import { GetProfile } from "@/api/profile";
import GetCookie from '@/hooks/cookies/getCookie';
import { GetrecentFlickers } from "@/api/recent-flickers";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FC, useState, useEffect } from "react";
import Modal from "../modal/modal";
import RecentFlickersTable from "../recent-flickers-table/recentFlickerTable";
import Identicon from 'react-identicons';
import BadgeModal from "../badge-modal/badge-modal";
import VerifyModal from "../verify-modal/verifyModal";
import UsernameModal from "../username-modal/usernameModal";
import { create } from "domain";
import { profile } from "console";

interface ProfileModalProps {
	show: boolean;
  handleModal: () => void;
}

const RecentTable = () => {
	const {data} = useQuery({
    queryKey: ['recent'],
	queryFn: GetrecentFlickers
  })
	return (
		<RecentFlickersTable classname="auto" tableData={data} />
	);
}

const ProfileModal:FC<ProfileModalProps> = ({ show, handleModal }) => {
	const[userId, setUserId] = useState(0);
	const[verified, setVerified] = useState(false);
	const[verificationDateTime, setVerificationDateTime] = useState("");
	const[gameNonce, setGameNonce] = useState("");
	const[data, setData] = useState(null);
	const[recentData, setRecentData] = useState(null);
	const[isError, setIsError] = useState(null);
	const[error, setError] = useState(null);
	const[pubKey, setPubkey] = useState('');
	const[username, setUsername] = useState('');
	const[createDate, setCreateDate] = useState('');
	const[showBadgeModal, setShowBadgeModal] = useState(false);
	const[showVerifyModal, setShowVerifyModal] = useState(false);
	const[showUsernameModal, setShowUsernameModal] = useState(false);
	const[showBadge, setShowBadge] = useState({
		name: '',
		desc: '',
		count: 0
	});
	const[badges, setBadges] = useState<any[]>([]);

	const badge_colors = {
		/* 
			1: red
			2: green
			3: blue
			4: yellow
			5: bora
			6: white
		*/
		"Advanced Loss Streak": 1,
		"Advanced Streak": 6,
		"All or Nothing": 4,
		"Beginner Loss Streak": 1,
		"Beginner Streak": 2,
		"Coin Emperor": 3,
		"Coin Master": 3,
		"Coin Psychic": 6,
		"Daily Player": 6,
		"Double or Nothing": 4,
		"Early Bird": 2,
		"First Flip": 2,
		"First Win": 2,
		"High Roller": 4,
		"Hot Loss Streak": 1,
		"Hot Streak": 6,
		"Intermediate Loss Streak": 1,
		"Intermediate Streak": 3,
		"Lucky Beginner": 2,
		"Monthly Master": 6,
		"Night Owl": 2,
		"Perfectionist": 6,
		"Perfectly Balanced b": 1,
		"Perfectly Balanced": 5,
		"Risk Taker": 4,
		"Streak Breaker": 4,
		"Underdog": 4,
		"Untitled_Artwork 68": 1,
		"Untouchable": 6,
		"Weekend Warrior": 6,
		"Yearlong Veteran": 5
	}

	const existing_badges = [
		"Advanced Loss Streak",
		"Advanced Streak",
		"All or Nothing",
		"Beginner Loss Streak",
		"Beginner Streak",
		"Coin Emperor",
		"Coin Master",
		"Coin Psychic",
		"Daily Player",
		"Double or Nothing",
		"Early Bird",
		"First Flip",
		"First Win",
		"High Roller",
		"Hot Loss Streak",
		"Hot Streak",
		"Intermediate Loss Streak",
		"Intermediate Streak",
		"Lucky Beginner",
		"Monthly Master",
		"Night Owl",
		"Perfectionist",
		"Perfectly Balanced b",
		"Perfectly Balanced",
		"Risk Taker",
		"Streak Breaker",
		"Underdog",
		"Untitled_Artwork 68",
		"Untouchable",
		"Weekend Warrior",
		"Yearlong Veteran"
	]
	
	// const {data: recentData} = useQuery({
	// 	queryKey: ['recent'],
	// 	queryFn: async () => await GetrecentFlickers()
	//   })

	if(isError) {
		enqueueSnackbar("Server Error", {variant: 'error', anchorOrigin: {horizontal: 'left', vertical: 'top'}})
	}

	const handleBadgeModal = (name: string, count: number, desc: string) => {
		setShowBadgeModal(!showBadgeModal);
		setShowBadge({
			name,
			count,
			desc,
		});
	}

	const updateBadge = (nonce: string) => {
		let temp = recentData.map(item => {
			if(item.gameNonce == nonce) {
				return {
					...item,
					verified: true
				}
			} else return item;
		})
		setRecentData(temp);
	}

	const handleUsernameModal = () => {
		setShowUsernameModal(!showUsernameModal);
	}

	const handleVerifyModal = () => {
		setShowVerifyModal(!showVerifyModal);
	}

	const handleUserName = async (value: any) => {
		let user_id = GetCookie('userId');
		if(value.length > 7) {
			enqueueSnackbar('The length of Username should be less than 7', {variant: 'error', anchorOrigin: {horizontal: 'left', vertical: 'top'}})
			return;
		}
		let res = await setUserName(value, Number(user_id));

		if(res?.status == 200 && res?.data.data == "OK") {
			handleUsernameModal();
			enqueueSnackbar('Updated username', {variant: 'success', anchorOrigin: {horizontal: 'left', vertical: 'top'}})
			setUsername(value);
		}
	}

	const copyReferralLink = () => {
		// @ts-ignore
		navigator.clipboard.writeText(window.location.origin+`?ref=${data?.data.data.referrals.referral_code}`)
		enqueueSnackbar('Copied', {variant: 'success', anchorOrigin: {horizontal: 'left', vertical: 'top'}})
	}

	const getProfileData = async () => {
		const profileData = await GetProfile();
		const _recentData = profileData?.data.data.formatted_games;
		if(profileData?.data.data.referrals?.error) {
			// @ts-ignore
			// enqueueSnackbar(profileData.data.data.referrals.error, {variant: 'error', anchorOrigin: {horizontal: 'center', vertical: 'center'}})
			setError(profileData.data.data.referrals.error)
		}
		// set username
		setUsername(profileData?.data.data.userName);
		// @ts-ignore
		setData(profileData);
		// @ts-ignore
		setRecentData(_recentData);
		// @ts-ignore
		setIsError(null);
	}

	useEffect(() => {
		getProfileData();
	}, [show])

	useEffect(() => {
		const key = GetCookie('publicKey');
    	setPubkey(`${key.slice(0, 5)}....${key.slice(-8)}`);
		
		const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		// @ts-ignore
		const stringDate = months[(new Date(data?.data.data.accountCreation)).getMonth()] + " " + (new Date(data?.data.data.accountCreation)).getFullYear()
		setCreateDate(stringDate);

		// @ts-ignore
		let res = data?.data.data.achievements.map((item: any) => {
			// let name = item.achievement_name.toLowerCase();
			// name = name.split(' ').join('_');
			if(existing_badges.includes(item.achievement_name)) {
				return {
					name: item.achievement_name,
					count: item.achievement_count,
					desc: item.description,
				}
			}
		}).filter((item: any) => {
			if(item == undefined) return false;
			return true;
		})

		for(var i = 0; i < res?.length; i++) {
			for(var j = (i + 1); j < res?.length; j++) {
				if(badge_colors[res[i].name] > badge_colors[res[j].name]) {
					let temp = res[i];
					res[i] = res[j];
					res[j] = temp;
				}
			}
		}

		let temp: any[] = res ? [...res] : [];
		let all_count = (res?.length > 9) ? (Math.floor(res.length / 3 )* 3 + (((res.length % 3) == 0) ? 0 : 3)) : 9;

		for(let i = 0; i < (all_count - res?.length); i++) {
			temp.push({
				name: 'blank_badge',
				count: 0,
				desc: ""
			})
		}

		setBadges(temp);
	}, [data])

  return(
		<Modal customClass={'profile-modal'} show={show} handleModal={handleModal}>
			<div className="profile">
				<img src="/static/svgs/close.svg" onClick={handleModal}/>
				<div className="profile-header">
					<div className="profile-header-left">
					<Identicon string={data?.data.data.publicKey} size={150} />
						<div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
								}}
							>
								<span
									style={{
										alignSelf: 'center',
										marginBottom: 'unset'
									}}
								>
									{/* @ts-ignore */}
									{username.slice(0,7)}{username.length > 7 && '..'}
								</span>
								<img 
									style={{
										width: '32px',
										cursor: 'pointer'
									}}
									src="/static/svgs/edit.svg"
									onClick={handleUsernameModal}
								/>
							</div>
							<span>
								{/* @ts-ignore */}
								{data?.data.data.publicKey.slice(0, 5)}....{data?.data.data.publicKey.slice(-8)}
							</span>
							<span>
								Flipping since <a>{createDate}</a>
							</span>
						</div>
					</div>
					<div className="profile-header-right">
						<div>
							<span>
								Current rank
							</span>
							<span>
								{/* @ts-ignore */}
								{data?.data.data.leaderboard.current}
							</span>
						</div>
						<div>
							<span>
								Highest
							</span>
							<span>
								{/* @ts-ignore */}
								{data?.data.data.leaderboard.best}
							</span>
						</div>
					</div>
				</div>
				<div className="profile-value">
					<div className="profile-value-item">
						<span>
							Success in a row
						</span>
						<span style={{
							color: '#5BEF43'
						}}>
							{/* @ts-ignore */}
							{data?.data.data.streaks.success}
						</span>
					</div>
					<div className="profile-value-item">
						<span>
							Fails in a row
						</span>
						<span style={{
							color: '#EF4343'
						}}>
							{/* @ts-ignore */}
							{data?.data.data.streaks.failure}
						</span>
					</div>
					<div className="profile-value-item">
						<span>
							XP points
						</span>
						<span style={{
							color: '#FDCD00'
						}}>
							{/* @ts-ignore */}
							{data?.data.data.points}
						</span>
					</div>
					<div className="profile-value-item">
						<span>
							Number of games
						</span>
						<span>
							{/* @ts-ignore */}
							{data?.data.data.gamesPlayed}
						</span>
					</div>
					<div className="profile-value-item">
						<span>
							Total amount bet
						</span>
						<span>
							{/* @ts-ignore */}
							{Math.round((parseFloat(data?.data.data.insights.totalAmountBet) + Number.EPSILON) * 100) / 100} $
						</span>
					</div>
					<div className="profile-value-item">
						<span>
							Winning percentage
						</span>
						<span>
							{/* @ts-ignore */}
							{data?.data.data.insights.winningPercentage} %
						</span>
					</div>
					<div className="profile-value-item">
						<span>
							Total earnings
						</span>
						<span>
							{/* @ts-ignore */}
							{Math.round((parseFloat(data?.data.data.insights.totalEarnings) + Number.EPSILON) * 100) / 100} $
						</span>
					</div>
					<div className="profile-value-item">
						<span>
							Avg. bet amount
						</span>
						<span>
							{/* @ts-ignore */}
							{Math.round((parseFloat(data?.data.data.insights.averageBetAmount) + Number.EPSILON) * 100) / 100} $
						</span>
					</div>
					
				</div>
				<div className="profile-other">
					<div className="history">
						<div className="title">
							Flip history
						</div>
						<div className="content">
							<ul className={`primary-list`}>
								<li className="primary-list__header">
								</li>
								<li>
									<ul >
									{
										// @ts-ignore
									recentData ? recentData.map((item, index) => (
										<li className="primary-list__item" key={index}>										
											<div className="primary-list__col-2">flipped <span>{Math.round((parseFloat(item.bet_amount) + Number.EPSILON) * 100) / 100} ΛRC</span> and <span style={{color: item.outcome == 'lost' ? '#EF4343' : '#5BEF43'}}>{item.outcome}</span></div>
											<div className="primary-list__col-3">{item.timeAgo}</div>
											<div className="primary-list__col">
												<img 
													src={`/static/svgs/check_${item.verified ? 'active' : 'inactive'}.svg`}
													onClick={() => {
														if(!item.verified) {
															setGameNonce(item.gameNonce);
															setUserId(item.user_id);
															setVerified(item.verified);
															handleVerifyModal();
														} else {
															setGameNonce(item.gameNonce);
															setVerified(item.verified);
															setVerificationDateTime(item.verifiedTimestamp);
															handleVerifyModal();
														}
													}}
												/>
											</div>
										</li>
									)) : <p style={{ textAlign: 'center', marginTop: 50 }}>Loading Data</p>
									}  
									</ul>  
								</li>
								
								<div>
								</div>
							</ul>
						</div>
					</div>
					<div className="referrals">
						<div className="title">
							Referrals
						</div>
						<div className="content">
							{
								error && <div className="error">
									<span>
										Referrals are not currently available in this region
									</span>
								</div>
							}
							{
								!error && <>
							<div className="code">
								<div>
									<span>
										Referral code
									</span>
									<span>
										{/* @ts-ignore */}
										{data?.data.data.referrals.referral_code}
									</span>
								</div>
								<img 
									src="/static/svgs/copy.svg" 
									onClick={copyReferralLink}
									style={{
										cursor: 'pointer'
									}}
								/>
							</div>
							<div className="statistics">
								<div className="user_number">
									<span>
										Number <br /> of users <br /> referred
									</span>
									<span>
										{/* @ts-ignore */}
										{data?.data.data.referrals.total_number_of_users_referred}
									</span>
								</div>
								<div className="total_earned">
									<span>
										Total <br /> earned
									</span>
									<span>
										{/* @ts-ignore */}
										{Number(data?.data.data.referrals.total_earned_through_referrals || 0).toFixed(2)}
									</span>
								</div>
							</div>
							</>}
						</div>
					</div>
					<div className="badges">
						<div className="title">
							Badges
						</div>
						<div className="content">
							{
								badges?.map((item, idx) => <div className="item" key={idx} onClick={() => item.name !== 'blank_badge' && handleBadgeModal(item.name, item.count, item.desc)}>
									{
										item.name === 'blank_badge' ? <img src={`/static/svgs/blank_badge.svg`} className={`${item.name === 'blank_badge' && 'blank'}`}/> :
										<img src={`/static/svgs/badges/${item.name}.svg`} className={`${item.name === 'blank_badge' && 'blank'}`}/>
									}
								</div>)
							}
						</div>
					</div>
				</div>
			</div>
			<BadgeModal 
				show={showBadgeModal}
				handleModal={() => handleBadgeModal("", 0, "")}
				badge={showBadge}
			/>
			<VerifyModal 
				verified={verified}
				gameNonce={gameNonce}
				userId={userId}
				show={showVerifyModal} 
				handleModal={handleVerifyModal}
				updateBadge={updateBadge}
				verificationDateTime={verificationDateTime}
			/>
			<UsernameModal 
				show={showUsernameModal} 
				handleModal={handleUsernameModal} 
				handleUserName={handleUserName}
			/>
		</Modal>
  )
}

export default ProfileModal;