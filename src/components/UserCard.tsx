import React from "react"
// import user from "../../assets/images/user.png"
interface Props{
    alignright: boolean
}

function UserCard(props: Props ){
    const pos = props.alignright ? "ml-auto mr-2" : "mr-auto ml-2"
    return(
    <div className={`bg-orange-300 flex w-3/5 rounded-lg h-12 items-center my-4 ${pos}`}>
        <img src="../../assets/images/user.png" alt="profile" className="object-contain ml-2"/>
        <h4 className="ml-4 flex-auto text-white font-medium ">Shruti2008</h4>
    </div>
    )
}

export default UserCard