import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showSpinner, hideSpinner } from "../common/spinner";
import { AppContext } from "../AppContext";
import moment from 'moment';
import { get, put, post } from "../../src/util/restUtil";
import EditProfile from "./EditProfile";
import { properties } from "../properties";
import { toast } from "react-toastify";
import ChangePassword from "./changePassword";



const MyProfile = () => {
    const [userData, setUserData] = useState([]);
    let { auth, setAuth } = useContext(AppContext);
    const { t } = useTranslation();
    const hiddenFileInput = React.useRef(null);
    const [renderState, setRenderState] = useState({
        showtab: 'editProfile',

    })
    const [file, setFile] = useState();
    const [state, setState] = useState(false);
    const [countries, setCountries] = useState([])
    const codeTypes = ["COUNTRY", "LOCATION", "USER_TYPE"]
    const [userCountry, setuserCountry] = useState(auth.user.country)
    const [userTypeDesc, setUserTypeDesc] = useState(auth.user.userType)
    const [locations, setLocations] = useState([])
    const [country, setCountry] = useState([])
    const [userTypes, setUserTypes] = useState([])
    let countryVals = []

    useEffect(() => {
        showSpinner();
        setFile(auth.user.profilePicture)
        setUserData(auth.user)
        get(properties.USER_API + "/" + auth.user.userId).then((resp) => {
            if (resp.data) {
                setUserData(resp.data)
            }
        }).finally(hideSpinner)
    }, [state,renderState]);

    useEffect(() => {

        showSpinner();
        post(properties.BUSINESS_ENTITY_API, codeTypes).then((resp) => {
            if (resp.data) {

                if (auth.user.country) {
                    let result = resp.data.COUNTRY.find((e) =>
                        e.code === auth.user.country)
                    setuserCountry(result.description)
                }
                if(auth.user.userType)
                {
                    let result = resp.data.USER_TYPE.find((e) =>
                    e.code === auth.user.userType )
                    setUserTypeDesc(result?.description || "")
                }

                countryVals = resp.data.COUNTRY.map((e) =>
                    ({ code: e.code, description: e.description, countryCode: e.mapping.countryCode })

                )

                setCountry(countryVals)

                setLocations(resp.data.LOCATION)

                setUserTypes(resp.data.USER_TYPE)
            }
            else {
                toast.error("Error while fetching country details")
            }
        }).finally(hideSpinner)

    }, []);



    const convertBase64 = (e) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);

            fileReader.onload = () => {
                resolve(fileReader.result);
                return fileReader.result
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };


    const handleChangeStatus = async (e) => {

        let image = await convertBase64(e);

        showSpinner()
        put(properties.USER_API + "/upload-profile-picture/" + auth.user.userId, { image })
            .then((resp) => {
                if (resp.status === 200) {
                    setAuth(prevState => ({ ...prevState, user: { ...prevState.user, profilePicture: image } }))
                    sessionStorage.getItem("auth")
                    toast.success("Image updated successfully.");

                } else {
                    toast.error("Error while updating user.");
                }
            })
            .finally(hideSpinner)

    }

    return (
        <>

            <div className="row">
                <div className="col-lg-4 col-xl-4">
                    <div className="card-box text-center">
                        <form>
                            <div className="text-center">
                                <img className="mb-2" id="img" src={file} width="150px" height="150px" style={{ objectFit: "cover" }}>
                                </img>
                            </div>

                            <input type="file"
                                accept="image/*"
                                name="image-upload"
                                id="input"
                                style={{ display: "none" }}
                                onChange={(e) => handleChangeStatus(e)}
                            />
                            <div style={{ width: "100%", marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                                <label style={{
                                    margin: "auto",
                                    padding: "10px",
                                    color: "white",
                                    textJustify: "auto",
                                    borderRadius: "3px",
                                    backgroundColor: "grey",
                                    textAlign: "center",
                                    cursor: "pointer",

                                }} htmlFor="input">

                                    Upload Photo
                                </label>
                            </div>

                        </form>


                        <h4 className="mt-2">{userData.firstName + " " + userData.lastName}</h4>


                        <div className="text-left mt-3 mb-1">
                            <table className="table table-striped dt-responsive nowrap w-100 border">
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label ">User Id :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData ? userData.userId : "-" }</div> </td>
                                </tr>
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label ">Full Name :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData ?  userData.firstName + " " + userData.lastName : "-"}</div> </td>
                                </tr>
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label">Gender :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData ? userData.gender === "F" ? "Female" : "Male" : "-"}</div> </td>
                                </tr>


                                <tr>
                                    <td><label for="customerTitle" className="col-form-label">Mobile   :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData ? "+" + userData.extn + userData.contactNo : "-"}</div> </td>
                                </tr>
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label">Email    :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData ? userData.email : "-"}</div> </td>
                                </tr>
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label">Country :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData ? userCountry : "-"}</div> </td>
                                </tr>
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label">Location    :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData && userData?.locationDet ? userData?.locationDet?.description : "-"}</div> </td>
                                </tr>
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label">User Type    :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData ? userTypeDesc : "-"}</div> </td>
                                </tr>
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label">Status     :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData ? userData.status : "-"}</div> </td>
                                </tr>
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label">Activation date     :</label></td>
                                    <td className="pt-1"><div className="pt-1">{userData ? moment(userData.activationDate).format('DD MMM YYYY') : "-"}</div> </td>
                                </tr>
                                <tr>
                                    <td><label for="customerTitle" className="col-form-label">Expiry date     :</label></td>
                                    <td className="pt-1"><div className="pt-1"></div>-</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8 col-xl-8 ">
                    <div className="card-box">
                        <ul className="nav nav-pills navtab-bg nav-justified">
                            <li className="nav-item">
                                <span id="editProfile"
                                    onClick={() => {
                                        setRenderState((prevState) => {
                                            return ({
                                                ...prevState,
                                                showtab: 'editProfile',

                                            })
                                        })

                                    }}
                                    className={(renderState.showtab === 'editProfile') ? 'nav-link active' : 'nav-link'}>
                                    Edit Profile
                                </span>
                            </li>
                            <li className="nav-item">
                                <span id="changePassword"
                                    onClick={() => {
                                        setRenderState((prevState) => {
                                            return ({
                                                ...prevState,
                                                showtab: 'changePassword'
                                            })
                                        })
                                    }}
                                    className={(renderState.showtab === 'changePassword') ? 'nav-link active' : 'nav-link'}>
                                    Change Password
                                </span>
                            </li>
                        </ul>
                        <div className="tab-content">
                            {

                                (renderState.showtab === 'editProfile') ?
                                    <EditProfile setState={setState} state={state} data={userData} countries={country} locations={locations} userTypes={userTypes}></EditProfile> :
                                    (renderState.showtab === 'changePassword') ? <ChangePassword></ChangePassword> :
                                        ""}


                        </div>
                    </div>

                </div>
            </div>






        </>
    );
};

export default MyProfile;
