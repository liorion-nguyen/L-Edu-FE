import SectionLayout from "../../../layouts/SectionLayout";
import ReturnPage from "../../../components/common/ReturnPage";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { dispatch, RootState, useSelector } from "../../../redux/store";
import { getSessionById } from "../../../redux/slices/courses";
import { Mode } from "../../../enum/course.enum";

const Video = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        fetch();
    }, [id]);
    const fetch = async () => {
        if (session) {
            return;
        }
        const check = await dispatch(getSessionById(id as string));
        if (!check) {
            navigate(-1);
        }
    }
    const { session, loading } = useSelector((state: RootState) => state.courses);
    // console.log(session);

    return (
        <SectionLayout title={document.title}>
            <ReturnPage />
            {
                session && session.videoUrl?.mode == Mode.OPEN &&
                <video
                    controls
                    autoPlay
                    // name="media"
                    style={{ width: "100%", borderRadius: "4px" }}
                >
                    <source
                        src={session?.videoUrl.videoUrl as string}
                        type="video/webm"
                    />
                    Your browser does not support the video tag.
                </video>
            }
        </SectionLayout>
    );
};

export default Video;
