import { GetrecentFlickers } from "@/api/recent-flickers";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import Modal from "../modal/modal";
import Exchange from "@/components/exchange/exchange"

interface ExchangeModalProps {
	show: boolean;
  handleModal: () => void;
}


const ExchangeModal:FC<ExchangeModalProps> = ({ show, handleModal }) => {
	useEffect(() => {
		
	})
  return(
		<Modal customClass={'exchange-modal'} show={show} handleModal={handleModal}>
			<Exchange />
		</Modal>
  )
}

export default ExchangeModal;