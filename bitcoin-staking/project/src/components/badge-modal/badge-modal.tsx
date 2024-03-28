import { FC, useEffect } from "react";
import Modal from "../modal/modal";
// ts-ignore

interface BadgeModalProps {
	badge: {
		name: string,
		count: number,
		desc: string,
	},
	show: boolean;
    handleModal: () => void;
}


const BadgeModal:FC<BadgeModalProps> = ({ badge, show, handleModal }) => {
	useEffect(() => {

	})
  return(
		<Modal customClass={'badge-modal'} show={show} handleModal={handleModal}>
			<img src="/static/svgs/close.svg" className="close" onClick={handleModal}/>
			<div className="title">
				You got a new badge!
			</div>
			<div className="badge_image">
				{badge.name && <img src={`/static/svgs/badges/${badge.name}.svg`} />}
			</div>
			<div className="desc">
				{badge.desc}
			</div>
		</Modal>
  )
}

export default BadgeModal;