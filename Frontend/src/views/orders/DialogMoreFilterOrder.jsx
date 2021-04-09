// import React, { useEffect, useState } from "react";
// import {
//     Radio,
//     RadioGroup,
//     FormControlLabel,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Switch,
//     Grid,
// } from "@material-ui/core";
// import { Button } from "react-bootstrap";
// import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
// import { toast } from "react-toastify";
// import { addNewSite, getSiteById, updateSite } from "./SiteService";
// import { useSelector } from "react-redux";

// toast.configure({
//     limit: 3,
//     autoClose: 3000,
//     closeOnClick: true,
//     hideProgressBar: false,
//     draggable: false,
// });

// const DialogMoreFilterOrder = (props) => {

//     useEffect(() => {

//     }, []);

//     return (
//         <Dialog
//             fullWidth={true}
//             maxWidth="xs"
//             open={open}
//             onClose={close}
//             style={{ zIndex: 1101 }}
//         >
//             {" "}
//             <ValidatorForm onSubmit={handleSubmitDialog}>
//                 <DialogTitle>
//                     {id ? "Update " : "Add new "}
//                     <Button size="sm" variant="primary" href="/">
//                         How To Install Private App Shopify
//                     </Button>
//                 </DialogTitle>

//                 <DialogContent>
//                     <TextValidator
//                         className="w-100 pb-3"
//                         value={site.store_name}
//                         onChange={handleChange}
//                         name="store_name"
//                         variant="outlined"
//                         label="Site Name"
//                         validators={["required"]}
//                         errorMessages={["this field is required"]}
//                         size="small"
//                         color="secondary"
//                         required
//                         autoComplete="off"
//                     />
//                     <TextValidator
//                         className="w-100 pb-3"
//                         variant="outlined"
//                         label="Store API Key"
//                         name="store_api_key"
//                         value={site.store_api_key}
//                         onChange={handleChange}
//                         validators={["required"]}
//                         errorMessages={["this field is required"]}
//                         size="small"
//                         color="secondary"
//                         required
//                         autoComplete="off"
//                     />
//                     <TextValidator
//                         className="w-100"
//                         variant="outlined"
//                         label="Store Password"
//                         name="store_password"
//                         value={site.store_password}
//                         onChange={handleChange}
//                         validators={["required"]}
//                         errorMessages={["this field is required"]}
//                         size="small"
//                         color="secondary"
//                         required
//                         autoComplete="off"
//                     />
//                     <TextValidator
//                         className="w-100"
//                         variant="outlined"
//                         label="Platform"
//                         name="who_entered"
//                         value={site.who_entered}
//                         onChange={handleChange}
//                         validators={["required"]}
//                         errorMessages={["this field is required"]}
//                         size="small"
//                         color="secondary"
//                         required
//                         autoComplete="off"
//                     />
//                     {/* <Grid
//                                 container
//                                 className="pt-3"
//                                 alignItems="center"
//                                 justify="space-between"
//                             > */}
//                     {/* <RadioGroup
//                                         value={site.who_entered}
//                                         onChange={handleChange}
//                                         name="type"
//                                         row
//                                     >
//                                         <FormControlLabel
//                                             value="amazon"
//                                             control={<Radio />}
//                                             label="Amazon"
//                                         />
//                                         <FormControlLabel
//                                             value="shopify"
//                                             control={<Radio />}
//                                             label="Shopify"
//                                         />
//                                     </RadioGroup> */}
//                     {/* </Grid> */}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={id ? handleUpdate : handleSubmitDialog}
//                         disabled={disabled}
//                         size="sm"
//                         variant="primary"
//                     >
//                         Save
//                     </Button>
//                     <Button onClick={close} size="sm" variant="secondary">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </ValidatorForm>
//         </Dialog>
//     );
// };

// export default DialogMoreFilterOrder;
