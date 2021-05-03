import React, { Suspense } from "react";
import Aux from "../../../../hoc/_Aux";
import Loader from "../../Loader";
import { homeObjFour, homeObjOne, homeObjThree } from "./Data";
import HeroSection from "./HeroSection";

const HomeLayout = (props, ref) => {
    return (
        <Aux>
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
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

export default HomeLayout;
