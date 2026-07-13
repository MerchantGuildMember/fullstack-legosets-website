import React from 'react'

export default function ProfileMenu(props) {

    const firstName = props.firstName;

    return(
        <div className="ProfileMenuWrapper">
            <div className="ProfileMenuOptions">

            <div className="Greeting">
                <h1>Hello, ${firstName}</h1>
            </div>

            <div className="editWrapper">

                <div className="editName">
                    <h2>edit name</h2>
                </div>
                <div className="editEmail">
                    <h2>edit email</h2>
                </div>
                <div className="editPassword">
                    <h2>edit password</h2>
                </div>
                <div className="editPfp">
                    <h2>edit pfp</h2>
                </div>
            </div>

            </div>
        </div>

    )
}