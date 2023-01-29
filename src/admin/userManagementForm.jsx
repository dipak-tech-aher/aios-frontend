import { useEffect, useState } from 'react';
import Switch from "react-switch";
import Modal from 'react-modal';
import Select from 'react-select'
import { properties } from "../properties";
import { post, put, get } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { string, object } from "yup";
import { isObjectEmpty } from '../util/validateUtil';


Modal.setAppElement('body');
const validationSchema = object().shape({
    title: string().required("Please select title"),
    firstName: string().required("Please enter first name"),
    lastName: string().required("Please enter last name"),
    gender: string().required("Please select gender"),
    email: string().required("Please enter email").email("Email is not in correct format"),
    dob: string().required("Please select date of birth"),
    userType: string().required("Please select user type"),
    notificationType: string().required("Please select notification type"),
    //country: string().required("Please select country"),
    location: string().required("Please select location"),
    contactNo: string().required("Please enter contact number"),
    //activationDate: string().required("Please select activation date"),
});

const UserManagementForm = (props) => {
    const [userList, serUserList] = useState({})
    const [isChecked, setIsChecked] = useState(props.userData.status === 'ACTIVE' ? true : false);
    const [biAccess, setBiAccess] = useState({ isActive: props.userData.biAccess === 'Y' ? true : false, value: "" });
    const [waAccess, setWaAccess] = useState({ isActive: props.userData.waAccess === 'Y' ? true : false, value: "" });
    const [defaultTile, setDefaultTile] = useState({});
    const [defaultNotification, setDefaultNotification] = useState({});
    const [defaultGender, setDefaultGender] = useState({});
    const [defaultUserType, setDefaultUserType] = useState({});
    const [defaultLocation, setDefaultlocation] = useState({});
    const [defaultRoles, setDefaultRoles] = useState({});
    const [defaultDomain, setDefaultDomain] = useState({});
    const [selectedRoles, setSelectedRoles] = useState({});
    const [departments, setDepartments] = useState()
    const [location, setLocation] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [genderLookup, setGenderLookup] = useState([])
    const [error, setError] = useState({});
    const [rolesData, setRolesData] = useState([])
    const [selectedMappingRoles, setSelectedMappingRoles] = useState()
    const [userInfo, setUserInfo] = useState({
        title: "",
        firstName: "",
        lastName: "",
        gender: "",
        email: "",
        dob: "",
        userType: "",
        notificationType: "",
        country: "",
        location: "",
        extn: "",
        contactNo: "",
        whatsappAccess: false,
        //   biAccessKey: "",
        biAccess: false,
        status: false
    })

    const { register, setValue, watch } = useForm();

    var userData = (props.isNewForm) ? [{ lastName: "", firstName: "", userName: "", contactNo: "", email: "", userType: "", location: "", userId: "", dob: "" }] : props.userData;

    useEffect(() => {
        if (!props.isNewForm) {
            setUserInfo(props ?.userData)
        }
        showSpinner();
        post(properties.BUSINESS_ENTITY_API, ['USER_TYPE', 'LOCATION', 'GENDER'])
            .then((resp) => {
                if (resp.data) {
                    let locationArr = []
                    resp.data.LOCATION.map((e) => {
                        locationArr.push({ label: e.description, value: e.code })
                    })
                    setLocation(locationArr)
                    let userTypeArr = []
                    resp.data.USER_TYPE.map((e) => {
                        userTypeArr.push({ label: e.description, value: e.code })
                    })
                    setUserTypes(userTypeArr)
                    let gender = []
                    resp.data.GENDER.map((e) => {
                        gender.push({ label: e.description, value: e.code })
                    })
                    setGenderLookup(gender)
                }
            })
            .finally(hideSpinner)

        if (props.isNewForm === false && userData.email !== "") {
            setValue("lastName", userData.lastName);
            setValue("firstName", userData.firstName);
            setValue("email", userData.email /*emailDomain(userData.email, 'name')*/);
            setValue("domain", getOptionName([...domainOptions], emailDomain(userData.email, 'domain'), 'value', 'label'));
            setValue("userType", userData.userType);
            setValue("title", userData.title);
            setValue("gender", userData.gender);
            setValue("location", userData.location);
            setValue("notificationType", userData.notificationType);
            setValue("biAccess", getOptionName([...biAccessOptions], userData.biAccess, 'value', 'value'));
            setValue("waAccess", getOptionName([...waAccessOptions], userData.waAccess, 'value', 'value'));
            setValue("status", userData.status);
            // setDefaultDomain(setSelectBoxDefaultValue(getOptionName([...domainOptions], emailDomain(userData.email, 'domain'), 'value', 'label'), 'domain'));
            // setDefaultTile(setSelectBoxDefaultValue(props.userData.title, 'title'));
            // setDefaultNotification(setSelectBoxDefaultValue(props.userData.notificationType, 'notificationType'));
            // setDefaultGender(setSelectBoxDefaultValue(props.userData.gender, 'gender'));
            // setDefaultUserType((setSelectBoxDefaultValue(props.userData.userType, 'userType')))
            // setDefaultlocation((setSelectBoxDefaultValue(props.userData?.location, 'location')))

            if (userData.mappingPayload && userData.mappingPayload.roles !== undefined && userData.mappingPayload.roles.length > 0) {
                setDefaultRoles(setRolesDefaultValue(userData.mappingPayload.roles));
            }
            let domainName = emailDomain(userData.email, 'domain');
        } else {
            resetForm();
        }
    }, [props]);
    useEffect(() => {

        let temp = []
        let departmentObject
        let roleDetails = []
        let roles = [];
        showSpinner();

        get(properties.ORGANIZATION)
            .then((resp) => {
                if (resp.data && resp.data.length > 0) {
                    departmentObject = resp.data
                    resp.data.map((e) => {
                        temp.push({ "unitId": e ?.unitId, "unitName": e ?.unitName, "unitDesc": e ?.unitDesc, "roles": e ?.mappingPayload ?.unitroleMapping || [] })
                    })
                    showSpinner();
                    get(`${properties.ROLE_API}`).then(resp => {
                        if (resp.data) {
                            if ((!isObjectEmpty(props ?.userData)) && props.isNewForm === false) {
                                let array = []
                                props ?.userData ?.mappingPayload ?.userDeptRoleMapping.map((e) => {
                                    temp.map((unit) => {
                                        if (unit.unitId === e.unitId) {
                                            e.roleId.map((id) => {
                                                resp.data.map((r) => {
                                                    if (id === r.roleId) {
                                                        array.push({
                                                            label: unit.unitName + '-' + r.roleDesc, value: { "id": r.roleId, "dept": e.unitId }, unitId: e.unitId
                                                        })
                                                    }
                                                })

                                            })
                                        }
                                    })

                                })

                                setSelectedMappingRoles(array)
                                setUserInfo({ ...props ?.userData, biAccess: props ?.userData.biAccess === 'Y' ? true : false })

                            }

                            roleDetails = resp.data;
                            roleDetails.map((role) => {
                                roles.push({ "roleId": role.roleId, "roleName": role.roleName, "roleDesc": role.roleDesc })
                            })
                            roleDetails = roles;
                            let departmentList = []
                            temp.map((t) => {
                                let rolesArray = []
                                t && t ?.roles && t ?.roles.map((r) => {
                                    roleDetails.map((role) => {
                                        if (Number(r) === Number(role.roleId)) {
                                            rolesArray.push(role)
                                        }
                                    })
                                })
                                departmentList.push({ ...t, roles: rolesArray })
                            })

                            let mappingList = []
                            departmentList.map((d) => {
                                let obj = { "label": d.unitDesc, "value": d.unitId }
                                let options = []
                                d.roles.map((r) => {
                                    options.push(
                                        { "label": r.roleDesc, "value": { "id": r.roleId, "dept": d.unitId }, "unitId": d.unitId }
                                    )
                                })
                                obj.options = options
                                mappingList.push(obj)
                            })
                            mappingList.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
                            setRolesData(mappingList)


                        }
                    }).finally(hideSpinner)

                    setDepartments(resp.data)
                }
            })


            .finally(hideSpinner)

    }, [props]);
    // const setSelectBoxDefaultValue = (defaultValue, selectBoxName) => {
    //     let tempArray = [];
    //     let optionArrray = [];
    //     if (selectBoxName === 'title') {
    //         optionArrray = [...titleOptions];
    //     } else if (selectBoxName === 'gender') {
    //         optionArrray = [...genderLookup];
    //     } else if (selectBoxName === 'notificationType') {
    //         optionArrray = [...notificationTypeOptions];
    //     } else if (selectBoxName === 'domain') {
    //         optionArrray = [...domainOptions];
    //     } else if (selectBoxName === 'userType') {
    //         optionArrray = [...userType]
    //     } else if (selectBoxName === 'location') {
    //         optionArrray = [...location]
    //     }
    //     optionArrray.map((title, i) => {
    //         if (title.value === defaultValue) {
    //             tempArray.push(optionArrray[i])
    //         }
    //     })

    //     return tempArray;
    // }
    const resetForm = () => {
        setValue("lastName", "");
        setValue("firstName", "");
        setValue("userName", "");
        setValue("contactNo", "");
        setValue("email", "");
        setValue("userType", "");
        setValue("title", "");
        setValue("location", "");
        setValue("notificationType", "");
        setValue("gender", "");
        setDefaultTile({});
        setDefaultNotification({});
        setDefaultGender({});
        setDefaultUserType({})
        setDefaultlocation({})
        setValue("roles", "");
        setDefaultRoles([]);
    }
    const setRolesDefaultValue = (selectedValues) => {
        let tempArray = [];
        let optionArrray = [];
        optionArrray = [...rolesOptions];

        optionArrray.map((optionData, i) => {
            for (let j = 0; j < selectedValues.length; j++) {
                if (optionData.label === selectedValues[j].role) {
                    tempArray.push(optionArrray[i])
                }
            }
        })
        return tempArray;
    }

    const rolesOptions = (props.roleList.length > 0) ? props.roleList : [];

    const biAccessOptions = [
        { value: 'Y', label: 'Yes' },
        { value: 'N', label: 'No' }
    ]
    const waAccessOptions = [
        { value: 'Y', label: 'Yes' },
        { value: 'N', label: 'No' }
    ]
    const domainOptions = [
        { value: 1, label: 'burunai.com' },
        { value: 2, label: 'imagine.bi' },
        { value: 3, label: 'gmail.com' },
    ]

    const notificationTypeOptions = [
        { value: 'SMS', label: 'SMS' },
        { value: 'EMAIL', label: 'Email' },
        // { value: 'WhatsApp', label: 'WhatsApp' }
    ]
    const titleOptions = [
        { value: 'Mr', label: 'Mr' },
        { value: 'Ms', label: 'Ms' },
        { value: 'Mrs', label: 'Mrs' },
    ]


    const emailDomain = (email, type) => {

        if (email !== undefined) {
            let emailSplit = (email.split("@") === undefined) ? email : email.split("@");
            if (emailSplit[0] === undefined) {
                return emailSplit;
            } else {
                return (type === "domain") ? emailSplit[1] : emailSplit[0];
            }
        }
    }
    const getOptionName = (optionArray, optionId, returnType, checkbyLabel) => {
        var domainName = "....";
        if (optionId !== undefined && optionId !== "") {
            optionArray.map(domain => {
                let compareValue = (checkbyLabel === 'value') ? domain.value : domain.label;
                if (compareValue === optionId) {
                    domainName = (returnType === "value") ? domain.value : domain.label;

                }
            })
            return domainName;
        }
    }

    // const onSubmit = (data, e) => {

    //     data['userId'] = props.isNewForm ? null : props.userData.userId
    //     // data['loginPassword'] = "Test@123";
    //     // data['email'] = data.email + '@' + getOptionName([...domainOptions], data.domain, 'label', 'value');
    //     data['contactNo'] = data.contactNo;
    //     //data['mappingPayload'] = { roles: selectedRoles }
    //     // e.target.reset();
    //     showSpinner();
    //     if (props.isNewForm) {
    //         post(properties.USER_API, data)
    //             .then((resp) => {
    //                 if (resp.data) {
    //                     toast.success(resp.message);
    //                     closeModal()
    //                 } else {
    //                     toast.error("Failed, Please try again");
    //                 }
    //             }

    //             )
    //             .finally(hideSpinner);
    //     }
    //     else {
    //         put(properties.USER_API + "/" + userData.userId, data)
    //             .then((resp) => {
    //                 if (resp.status === 200) {
    //                     toast.success(resp.message);
    //                     closeModal()
    //                 } else {
    //                     toast.error("Failed, Please try again");
    //                 }
    //             }

    //             )
    //             .finally(hideSpinner);
    //     }

    // }
    const validate = (schema, form) => {
        try {

            schema.validateSync(form, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };
    const handleSubmit = () => {

        let error = validate(validationSchema, userInfo);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return
        }

        // if (userInfo.biAccess && (userInfo.biAccessKey === null || userInfo.biAccessKey === undefined)) {
        //     toast.error("Please Enter Bi Access Key")
        //     return
        // }

        // if (props?.isNewForm === true && isObjectEmpty(selectedRoles)) {
        //     toast.error("Please select roles")
        //     return;
        // }
        let units
        let userObject = userInfo
        userObject = {
            ...userObject,
            contactNo: Number(userObject.contactNo),
            extn: Number(userObject.extn),
            whatsappAccess: userObject.whatsappAccess === false ? "N" : "Y",
            biAccess: userObject.biAccess === false ? "N" : "Y",
        }

        if (!isObjectEmpty(selectedRoles)) {
            units = selectedRoles.map(item => item.unitId).filter((value, index, self) => self.indexOf(value) === index)
            let mapping = []
            units.map((u) => {
                let roles = []

                selectedRoles.map((s) => {
                    if (s.unitId === u) {
                        roles.push(s.value.id)
                    }
                })
                mapping.push({
                    "roleId": roles,
                    "unitId": u
                })
            })

            let mappingPayloadFinal = {
                "userDeptRoleMapping": mapping
            }

            userObject.mappingPayload = mappingPayloadFinal

        }

        if (props ?.isNewForm === true) {
            showSpinner();

            post(properties.USER_API, userObject)
                .then((resp) => {
                    if (resp.data) {
                        toast.success(resp.message);
                        closeModal()
                        setUserInfo({})
                    } else {
                        toast.error("Failed, Please try again");
                    }
                }

                )
                .finally(hideSpinner);
        } else {

            showSpinner();

            put(properties.USER_API + "/" + userInfo ?.userId, userObject)
                .then((resp) => {
                    if (resp.status = 200) {
                        toast.success(resp.message);
                        closeModal()
                        setUserInfo({})
                    } else {
                        toast.error("Failed, Please try again");
                    }
                }

                )
                .finally(hideSpinner);
        }


    }

    const closeModal = () => {
        props.isModal();
    }
    const handleChangeswitch = () => {
        let checkvalue = (isChecked) ? false : true;
        setValue("status", checkvalue);
        setUserInfo({ ...userInfo, status: checkvalue === true ? "ACTIVE" : "INACTIVE" })
        setIsChecked(checkvalue);
    }

    const accessChangeswitch = (type) => {
        let checkvalue = [];
        let ObjData = (type === "BI_ACCESS") ? biAccess : waAccess;

        if (ObjData.isActive) {
            checkvalue = { isActive: false, value: "N" }
        } else {
            checkvalue = { isActive: true, value: "Y" }
        }
        if (type === "BI_ACCESS") {
            setValue("biAccess", checkvalue.value);
            setBiAccess(checkvalue)
        } else {
            setValue("waAccess", checkvalue.value);
            setWaAccess(checkvalue);
        }
    }

    const handleChange = (selectedOptions) => {
        // let roles = [];
        // if (selectedOptions.length > 0) {
        //     selectedOptions.map(item => {
        //         roles.push({ name: "", role: item.label, unitType: "" })
        //     });
        // }
        setSelectedRoles(selectedOptions);
    }

    return (

        <div className="row" id="datatable">
            <Modal
                appElement={document.getElementById('app')}
                isOpen={props.isOpenModal}
                contentLabel="Example Modal"
            >
                <div >

                    <div style={{ padding: '0px 20px 20px 20px' }} className="row">
                        <div className="col-md-12 user-det">
                            <div className="modal-header"><h4 className="modal-title">User Details</h4></div>

                            <button onClick={closeModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>

                        </div>
                        <div className="border-line clearfix"><hr></hr></div>
                        <fieldset className="scheduler-border">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">Title&nbsp;<span>*</span></label>
                                        <Select
                                            closeMenuOnSelect={true}
                                            defaultValue={userInfo ?.title ? titleOptions.filter((f) => f.value === userInfo ?.title) : ""}
                                            options={titleOptions}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    title: e.value,
                                                });
                                                setError({ ...error, title: "" })
                                            }}
                                            name="title"
                                            placeholder={"Please Select Title"}
                                        />

                                        {error.title && <span className="errormsg">{error.title}</span>}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">First Name&nbsp;<span>*</span></label>
                                        <input className={`form-control ${(error.firstName ? "input-error" : "")}`} placeholder="Enter First Name"
                                            value={userInfo.firstName}
                                            type="text"
                                            maxLength={40}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    firstName: e.target.value,
                                                });
                                                setError({ ...error, firstName: "" })
                                            }} />
                                        {error.firstName ? <span className="errormsg">{error.firstName}</span> : ""}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">Last Name&nbsp;<span>*</span></label>
                                        <input className={`form-control ${(error.lastName ? "input-error" : "")}`} placeholder="Enter Last Name"
                                            value={userInfo.lastName}
                                            type="text"
                                            maxLength={40}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    lastName: e.target.value,
                                                });
                                                setError({ ...error, lastName: "" })
                                            }} />
                                        {error.lastName ? <span className="errormsg">{error.lastName}</span> : ""}

                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">Gender&nbsp;<span>*</span></label>
                                        <Select
                                            closeMenuOnSelect={true}
                                            defaultValue={userInfo ?.gender ? (userInfo ?.gender === "M" ? [{ label: "Male", value: "M" }] : [{ label: "Female", value: "F" }]) : ""}
                                            //   defaultValue={userInfo.gender ? userInfo.gender : "Please Select Gender"}
                                            options={genderLookup}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    gender: e.value,
                                                });
                                                setError({ ...error, gender: "" })
                                            }}
                                            name="gender"
                                            placeholder={"Please Select Gender"}
                                        />
                                        {error.gender ? <span className="errormsg">{error.gender}</span> : ""}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">Email Id&nbsp;<span>*</span></label>
                                        <input className={`form-control ${(error.email ? "input-error" : "")}`} placeholder="Please Enter Email"
                                            value={userInfo.email}
                                            type="email"
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    email: e.target.value,
                                                });
                                                setError({ ...error, email: "" })
                                            }} />
                                        {error.email ? <span className="errormsg">{error.email}</span> : ""}

                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">DOB&nbsp;<span>*</span></label>
                                        <input className={`form-control ${(error.dob ? "input-error" : "")}`} placeholder="Please Enter Date of Birth"
                                            type="date"
                                            value={userInfo.dob}
                                            max={moment(new Date()).format('YYYY-MM-DD')}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    dob: e.target.value,
                                                });
                                                setError({ ...error, dob: "" })
                                            }} />
                                        {error.dob ? <span className="errormsg">{error.dob}</span> : ""}

                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <div style={{ display: "flex" }}>
                                            <div style={{ width: "25%" }}>
                                                <label className="control-label">Extn No</label>
                                                <NumberFormat className={`form-control ${(error.extn ? "input-error" : "")}`} placeholder="Extn"
                                                    value={userInfo.extn}
                                                    onChange={(e) => {
                                                        setUserInfo({
                                                            ...userInfo,
                                                            extn: e.target.value,
                                                        });
                                                        setError({ ...error, extn: "" })
                                                    }} />
                                                {error.extn && <span className="errormsg" role="alert">{error.extn.message}</span>}
                                            </div>
                                            <div style={{ width: "10px" }}>  </div>
                                            <div style={{ width: "75%" }}>
                                                <label className="control-label">Contact Number&nbsp;</label>
                                                <NumberFormat className={`form-control ${(error.contactNo ? "input-error" : "")}`} placeholder="Please Enter Contact Number"
                                                    value={userInfo.contactNo}
                                                    maxLength={7}
                                                    onChange={(e) => {
                                                        setUserInfo({
                                                            ...userInfo,
                                                            contactNo: e.target.value,
                                                        });
                                                        setError({ ...error, contactNo: "" })
                                                    }} />

                                                {error.contactNo && <span className="errormsg" role="alert">{error.contactNo}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">User Type&nbsp;</label>
                                        {userTypes.length > 0 && <Select
                                            closeMenuOnSelect={true}
                                            defaultValue={userInfo ?.userType && userTypes ? (userTypes.filter((f) => f.value === userInfo ?.userType)) : ""}
                                            //   defaultValue={userInfo.gender ? userInfo.gender : "Please Select Gender"}
                                            options={userTypes}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    userType: e.value,
                                                });
                                                setError({ ...error, userType: "" })
                                            }}
                                            name="userType"
                                            placeholder={"Please Select User Type"}
                                        />}
                                        {error.gender ? <span className="errormsg">{error.userType}</span> : ""}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">Notification Type&nbsp;</label>
                                        <Select
                                            closeMenuOnSelect={true}
                                            defaultValue={userInfo ?.notificationType ? notificationTypeOptions.filter((f) => f.value === userInfo ?.notificationType) : ""}
                                            //   defaultValue={userInfo.gender ? userInfo.gender : "Please Select Gender"}
                                            options={notificationTypeOptions}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    notificationType: e.value,
                                                });
                                            }}
                                            name="notification"
                                            placeholder={"Please Select Notification Type"}
                                        />
                                        {error.notificationType && <span className="errormsg">{error.notificationType}</span>}
                                    </div>
                                </div>
                                {/* <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">Location</label>

                                        <select
                                            {...register("location", { required: true })}
                                            className="form-control" id="example-select"
                                            onChange={(selectedOptions) => {
                                                setValue("location", selectedOptions.value);
                                            }} defaultValue={defaultLocation} options={userlocation}>
                                            {location.map((e) => (
                                                <option key={e.code} value={e.code}>{e.description}</option>
                                            ))}
                                        </select>
                                        {errors.location && <span>This field is required</span>}
                                    </div>
                                </div> */}
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">Location&nbsp;</label>
                                        {location.length > 0 && <Select
                                            closeMenuOnSelect={true}
                                            defaultValue={userInfo ?.location && location ? location.filter((f) => f.value === userInfo ?.location) : ""}
                                            //   defaultValue={userInfo.gender ? userInfo.gender : "Please Select Gender"}
                                            options={location}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    location: e.value,
                                                });
                                                setError({ ...error, location: "" })

                                            }}
                                            name="location"
                                            placeholder={"Please Select Location"}
                                        />}
                                        {error.location && <span className="errormsg">{error.location}</span>}

                                    </div>
                                </div>


                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">BI Access</label>
                                        <Switch checked={userInfo ?.biAccess}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    biAccess: (!userInfo.biAccess)
                                                });

                                            }} />


                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">WhatsApp Access</label>
                                        <Switch checked={userInfo ?.whatsappAccess}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    whatsappAccess: (!userInfo.whatsappAccess)
                                                });

                                            }} />


                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="control-label">Status</label>
                                        <Switch onChange={handleChangeswitch} checked={isChecked} />
                                    </div>
                                </div>
                            </div>
                            <div className=" pt-2" >
                                <div className="col-12 pl-2 bg-light border" > <h5 className="text-primary" >User Roles Mapping</h5 > </div >
                            </div >
                            <br></br>
                            {
                                props.isNewForm === false && rolesData && selectedMappingRoles &&

                                <form className="d-flex justify-content-center" >
                                    <div style={{ width: "100%" }}>

                                        <Select
                                            closeMenuOnSelect={false}
                                            defaultValue={selectedMappingRoles ? selectedMappingRoles : null}
                                            options={rolesData}
                                            getOptionLabel={option => `${option.label}`}
                                            // formatOptionLabel={option => `${option.label} - ${option.value}`} 
                                            onChange={handleChange}
                                            isMulti
                                            isClearable
                                            name="roles"
                                            menuPortalTarget={document.Modal}

                                        />
                                    </div>
                                </form>


                            }
                            {
                                props.isNewForm === true && rolesData &&

                                <form className="d-flex justify-content-center" >
                                    <div style={{ width: "100%" }}>
                                        <Select
                                            closeMenuOnSelect={false}
                                            defaultValue={null}
                                            options={rolesData}
                                            getOptionLabel={option => `${option.label}`}
                                            onChange={handleChange}
                                            isMulti
                                            isClearable
                                            name="roles"

                                        />
                                    </div>
                                </form>


                            }
                        </fieldset>
                        {/* <div className="col-12 pl-2 bg-light border mt-2"><h5 className="text-primary">User - Role Mapping</h5> </div>

                        <div className="col-md-12">
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={defaultRoles}
                                isMulti
                                onChange={handleChange}
                                name="roles"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={rolesOptions} />
                        </div> */}
                        {/* <h4>Set User Level Permission</h4> */}
                        <div style={{ marginTop: "30px" }} className="col-md-12 text-center">
                            <button className="btn waves-effect waves-light btn-primary" onClick={handleSubmit} >Submit</button>
                            <button className="btn waves-effect waves-light btn-secondary" onClick={closeModal}>Close</button>
                        </div>
                    </div >
                </div >
            </Modal >
        </div >

    );
};

export default UserManagementForm;
