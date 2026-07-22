import React from 'react'

export default function ProfileMenu(props) {

    const firstName = props.firstName;

    return(
        <div className="ac_profileMenuWrapper">
            <div className="ac_profileMenuOptions">

            <div className="ac_greeting">
                <h1>Hello, ${firstName}</h1>
            </div>

            <div className="ac_editWrapper">

                <div className="ac_editName">
                    <h2>edit name</h2>
                </div>
                <div className="ac_editEmail">
                    <h2>edit email</h2>
                </div>
                <div className="ac_editPassword">
                    <h2>edit password</h2>
                </div>
                <div className="ac_editPfp">
                    <h2>edit pfp</h2>
                </div>
            </div>

            </div>
        </div>

    )
}