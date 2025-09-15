import { addSellerRole } from '../../utils/api/role.api';
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { user } = useAuth();

  const becomeSeller = async (userId) => {
    try {
      const res = await addSellerRole(userId);
      console.log(res);
    } catch (error) {
      console.log("Error in adding user as seller: ", error);
    }
  }

  return (
    <div className='flex justify-center min-h-screen items-center'>
      <button 
        className='hover:text-gray-500 cursor-pointer bg-gray-600 p-2 rounded transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gray-950'
        onClick={() => becomeSeller(user.id)}
      >Become a seller</button>
    </div>
  )
}

export default Profile
