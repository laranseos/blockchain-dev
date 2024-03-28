import { GetrecentFlickers } from "@/api/recent-flickers";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import Modal from "../modal/modal";
import RecentFlickersTable from "../recent-flickers-table/recentFlickerTable";
// ts-ignore
interface tableData {
	bet_amount: string;
	outcome: string;
	timeAgo: string;
	public_key: string;
	verified: boolean;
  }

interface RecentFlickersModalProps {
	tableData: Array<tableData>;
	show: boolean;
  handleModal: () => void;
}


const RecentFlickersModal:FC<RecentFlickersModalProps> = ({ tableData, show, handleModal }) => {
	useEffect(() => {
		
	})
  return(
		<Modal customClass={'flickers-modal'} show={show} handleModal={handleModal}>
			{`// @ts-ignore`}
			<RecentFlickersTable tableData={tableData} />
		</Modal>
  )
}

export default RecentFlickersModal;