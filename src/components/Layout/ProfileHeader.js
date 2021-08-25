import '../../static/styles/profileHeader.css';

function ProfileHeader() {
  return (
    <div className='profile_menu_header page_container'>
      <h1> My Profile </h1>
      <div className='profile_menu'>
        <a href='/myvalueeat'>
          My ValueEat
        </a>
        <a href={`/account`}>
          Account
        </a>
        <a href={`/profile`}>
          Profile
        </a>
      </div>
    </div>
  )
}

export default ProfileHeader