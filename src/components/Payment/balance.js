import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';
import { extractUId } from '../../utils/token';
import ProfileHeader from '../Layout/ProfileHeader';

function Balance({ profile, balance }) {
    const [balance_amount, setBalanceAmount] = React.useState({});
    const token = React.useContext(AuthContext);
    const u_id = extractUId(token);
    console.log(token, u_id)

    /*React.useEffect(() => {
        axios
            .get(`/user/balance`, { params: { token, u_id: balance } })
            .then(({ data }) => {
                console.log(data);
                setAccountDetails(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account, token]);*/

    return (
        <div>
            <ProfileHeader />
            <div style={{ maxWidth: '1228px' }} className='page_container'>
                <form class="payment">
                    <div class="amount">
                        <h1>My Balance Amount: </h1>
                        <p>A$ 0.00</p>
                    </div>
                    <div class="payment_balanceStyle">
                        <a >
                            <span>Top up A$100</span>
                        </a>
                    </div>
                    <div class="payment_balanceStyle">
                        <a >
                            <span>Top up A$200</span>
                        </a>
                    </div>
                    <div class="payment_balanceStyle">
                        <a >
                            <span>Top up A$400</span>
                        </a>
                    </div>
                    <div class="payment_balanceStyle">
                        <a >
                            <span>Top up A$800</span>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Balance;