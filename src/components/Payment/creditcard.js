import axios from 'axios';
import React from 'react';
import AuthContext from '../../AuthContext';
import { extractUId } from '../../utils/token';
import ProfileHeader from '../Layout/ProfileHeader';
import '../../static/styles/creditcard.css';


function CreditCard({ profile, card_number }) {
    const [accountDetails, setAccountDetails] = React.useState({});
    const token = React.useContext(AuthContext);
    const u_id = extractUId(token);
    console.log(token, u_id)

    /*React.useEffect(() => {
        axios
            .get(`/user/creditcard`, { params: { token, u_id: account } })
            .then(({ data }) => {
                console.log(data);
                setAccountDetails(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account, token]); */


    return (
        <div>
            <ProfileHeader />
            <div style={{ maxWidth: '1228px' }} className='page_container'>
                <form class="credit-card">
                    <div class="form-header">
                        <h4 class="title">Credit card detail</h4>
                    </div>

                    <div class="form-body">

                        <input type="text" class="card-number" placeholder="Card Number" />


                        <div class="date-field">
                            <div class="month">
                                <select name="Month">
                                    <option value="january">January</option>
                                    <option value="february">February</option>
                                    <option value="march">March</option>
                                    <option value="april">April</option>
                                    <option value="may">May</option>
                                    <option value="june">June</option>
                                    <option value="july">July</option>
                                    <option value="august">August</option>
                                    <option value="september">September</option>
                                    <option value="october">October</option>
                                    <option value="november">November</option>
                                    <option value="december">December</option>
                                </select>
                            </div>
                            <div class="year">
                                <select name="Year">
                                    <option value="2016">2016</option>
                                    <option value="2017">2017</option>
                                    <option value="2018">2018</option>
                                    <option value="2019">2019</option>
                                    <option value="2020">2020</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                </select>
                            </div>
                        </div>

                        <div class="card-verification">
                            <div class="cvv-input">
                                <input type="text" placeholder="CVV" />
                            </div>
                            <div class="cvv-details">
                                <p>3 or 4 digits usually found  on the signature strip</p>
                            </div>
                        </div>

                        <button type="submit" class="proceed-btn"><a href="#">Proceed</a></button>
                        <button type="submit" class="paypal-btn"><a href="#">Pay With</a></button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreditCard;