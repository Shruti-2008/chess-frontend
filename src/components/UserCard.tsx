import React from "react"
// import user from "../../assets/images/user.png"
interface Props {
    alignright: boolean
}

function UserCard(props: Props) {
    const pos = props.alignright ? "ml-auto mr-2" : "mr-auto ml-2"
    return (
        <div className={`bg-amber-200 flex w-3/5 rounded-lg h-12 items-center my-4 ${pos} shadow-lg shadow-stone-500/50`}>
            <div>
                <img src="../../assets/images/user.png" alt="profile" className="object-contain ml-2" />
            </div>
            <div className="flex flex-col">
                <h4 className="ml-4 flex-auto font-medium text-lg ">Shruti2008</h4>
                {/* <Drawer {...}/> */}
            </div>
        </div>
    )
}

export default UserCard