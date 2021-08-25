import { Chart, registerables } from 'chart.js'
import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';

import EateryProfileHeader from '../Layout/EateryProfileHeader';
import { extractEateries } from '../../utils/token';

import '../../static/styles/eateryaccount.css'

function EateryAccount({ e_id, page}) {
  Chart.register(...registerables);
  const token = React.useContext(AuthContext)
  const [values, setValues] = React.useState();
  const [sellAnalysis, setSellAnalysis] = React.useState({
    Nsell: 0,
    Ndiscount: 0,
    Nrevenue: 0,
  });
  const MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  React.useEffect(() => {
    console.log('eatery voucher useEffect')
    axios
    .get(`/eatery/get/acoount`, { params: { token, e_id, page } })
    .then(({ data }) => {
      /* {
        Nsell: 1,
        Ndiscount: 1,
        Nrevenue: 1,
      } data['analysis']*/
      setSellAnalysis({
        Nsell: data['Nsell'],
        Ndiscount: data['Ndiscount'],
        Nrevenue: data['Nrevenue'],
      })
      // Year Analysis
      const Ydata = {
        labels: MONTHS,
        datasets: [{
          label: 'Sale for each month',
          data: data['Ydata'], // [12 Num from Jan - Dec]
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }

      const Yconfig = {
        type: 'line',
        data: Ydata,
      }

      const ctx = document.getElementById('YearSale');
      new Chart(ctx, Yconfig);

      // Day Analysis
      let startDate = new Date(), endDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      // 'Ddata' [{x: 'Jul 05', y:20}, {x: 'Jul 26', y:10}, {x: 'Jul 27', y:40}, {x: 'Jul 28', y:30}, {x: 'Jul 29', y:60}]
      const Ddata = {
        datasets: [{
          label: 'Sale for past 30 days',
          data: data['Ddata'],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }

      const Dconfig = {
        type: 'line',
        data: Ddata,
        options: {
          scales: {
            x: [{
              beginAtZero: true,
              type: "time",
              time: {
                min: startDate,
                max: endDate,
                unit: "day"
              }
            }],
            y: {
              beginAtZero: true
            }
          }
        }
      }
      const ctx2 = document.getElementById('DaySale');
      new Chart(ctx2, Dconfig);

      // Pie chart
      const PieData = {
        labels: data['topVoucher'], // max 10 ['e', 'Orange', 'Yellow', 'Green', 'Blue']
        datasets: [
          {
            label: 'Dataset 1',
            data: data['NVoucherSell'], // [8,1,2,3,4],
            backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
          }
        ]
      }

      const Pieconfig = {
        type: 'pie',
        data: PieData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Top Sale Voucher Analysis',
              font: { size: 20 }
            }
          }
        }
      }
      const ctx3 = document.getElementById('VoucherAnalysis');
      new Chart(ctx3, Pieconfig);
    })
    .catch((err) => {
        console.error(err);
    });
  }, [])

  return (
    <div>
      <EateryProfileHeader e_id={e_id} eateries={extractEateries(token)} />
      <div style={{maxWidth: '1228px'}} className='account_container page_container'>
        <div className='Total_analysis'>
          <h1>Total Analysis</h1>
          <div className='analysis_detail'>
            <span>Total Sell: {sellAnalysis.Nsell}</span>
            <span>Total Discount: {sellAnalysis.Ndiscount} </span>
            <span>Total Revenue: {sellAnalysis.Nrevenue}</span>
          </div>
        </div>

        <div className='chart_analysis'>
          <div className='sale_analysis'>
            <h1>Sale Analysis</h1>
            <canvas id="YearSale" style={{width: '100%', height: 200, display: 'block', marginBottom: 20}}/>
            <canvas id="DaySale" style={{width: '100%', height: 200, display: 'block'}}/>
          </div>

          <div className='sale_detail'>
            <canvas id="VoucherAnalysis" style={{width: '100%', height: 200, display: 'block'}}/>
          </div>
        </div>
      </div>
    </div>
  );
}



export default EateryAccount