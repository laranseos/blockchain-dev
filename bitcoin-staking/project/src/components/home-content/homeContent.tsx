import { useGlobalContext } from '@/app/react-query-provider/reactQueryProvider';
import { GetrecentFlickers } from "@/api/recent-flickers";
import SetCookie from "@/hooks/cookies/setCookie";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import PlayModal from "../play-modal/playModal";
import RecentFlickersTable from "../recent-flickers-table/recentFlickerTable";
import RecentFlickersModal from "../recent-flickers-modal/recentFlickersModal";
import { playButtonAudio } from "@/sound";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import GetCookie from "@/hooks/cookies/getCookie";

const HomeContent: FC = () => {
  const router = useRouter();
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [start, setStart] = useState(false);
  const [count, setCount] = useState(0);
  const searchParams = useSearchParams();
  const search = searchParams.get("ref");
  const { isLoggedin, setIsLoggedIn } = useGlobalContext();

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ["recent"],
    queryFn: GetrecentFlickers,
  });

  useEffect(() => {
    const isLogin = GetCookie("isLogin");
    setIsLoggedIn(!!isLogin ? true : false);
    if(!!isLogin) {
      router.push('/flip-coin')
    }
  }, []);

  if (search != null) {
    SetCookie("refCode", search);
  }

  const handleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <div>
      <div className="home-content">
        <section>
          <h1 className="heading-primary">
            <div className='crt result h-100'>
              <img src="/static/img/landing.png" style={{ width: "100%" }} alt="landing" />
            </div>
          </h1>
        </section>
        <section className="center-area">
          <span>
            #1 place to <br /> tug the nug and <br /> coin flip
          </span>
          <div
            className="start_button"
            onClick={() => {
              playButtonAudio();
              handleModal();
              setCount(1000)
              setTimeout(() => {
                setCount(0);
              }, 1000)
            }}
          ></div>
          <RecentFlickersTable tableData={data} />
        </section>
      </div>
      <PlayModal show={showModal} handleModal={handleModal} />
    </div>
  );
};

export default HomeContent;
