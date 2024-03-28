import { FC, useEffect } from "react";

interface tableData {
  bet_amount: string;
  outcome: string;
  timeAgo: string;
  public_key: string;
  verified: boolean;
}

interface RecentFlickersTableProps {
  tableData: Array<tableData>;
  classname?: string;
}

const RecentFlickersTable:FC<RecentFlickersTableProps> = ({ tableData, classname }) => {
  useEffect(() => {
  
  })
  return(
    <ul className={`primary-list primary-list--${classname ? classname : 'home'}`}>
      <li className="primary-list__header">
        <div className="primary-list__header__col">Most recent been flickers</div>
        <div className="primary-list__header__col-2"></div>
      </li>
      <li>
        <ul>
        {
          tableData ? tableData.map((item, index) => (
            <li className="primary-list__item" key={index}>
              <div className="primary-list__col" style={{marginRight: '8px',}}>{
                // @ts-ignore
                item?.user_name
              }</div>
              <div className="primary-list__col-2">flipped <span>{Math.round((parseFloat(item.bet_amount) + Number.EPSILON) * 100) / 100} ΛRC</span> and <span style={{color: item.outcome == 'lost' ? '#EF4343' : '#5BEF43'}}>{item.outcome}</span></div>
              <div className="primary-list__col-3">{item.timeAgo}</div>
              <div className="primary-list__col">
												<img 
													src={`/static/img/${item.verified ? 'gold' : 'gray'}_check.png`}
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
  )
}

export default RecentFlickersTable;