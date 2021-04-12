import React, { Suspense } from "react";
import Aux from "../../../../hoc/_Aux";
import Loader from "../../Loader";
import NavBar from "../Navbar/NavbarTop";
import NavbarBottom from "../Navbar/NavbarBottom";
import HeroSection from "./HeroSection";
import { homeObjOne, homeObjThree, homeObjTwo, homeObjFour } from "./Data";

const HomeLayout = (props, ref) => {
    return (
        <Aux>
            <NavBar />
            <div className="pcoded-main-container">
                <div className="pcoded-wrapper">
                    <div className="pcoded-content">
                        <div className="pcoded-inner-content">
                            <div className="main-body">
                                <div className="page-wrapper">
                                    <Suspense fallback={<Loader />}>
                                        <HeroSection {...homeObjThree} />
                                        <HeroSection {...homeObjOne} />
                                        <HeroSection {...homeObjFour} />
                                        <HeroSection {...homeObjTwo} />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NavbarBottom />
        </Aux>
    );
};

export default HomeLayout;
