import { useNavigate } from "react-router-dom";
import "./Home.css";


export default function Home() {
    const navigate = useNavigate();

    return (
        <>

        <div className="home-container">
            <section className="home">
                <div className="home-text">
                    <h1>Effortless <span>Timesheets</span> for Professionals</h1>
                    <p>Manage work hours efficiently with this time tracking system.</p>
                    <div className="home-buttons">
                        <button className="btn primary" onClick={() => navigate("/login")}>Get Started</button>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>Your Work, Organized.</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <i className="fas fa-clock"></i>
                        <h3>Track Work Hours</h3>
                        <p>Log your work hours accurately and efficiently.</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-calendar-alt"></i>
                        <h3>Manage Schedules</h3>
                        <p>Stay on top of deadlines and manage your hours effortlessly.</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-file-alt"></i>
                        <h3>Generate Reports</h3>
                        <p>Export detailed reports for payroll processing.</p>
                    </div>
                </div>
            </section>
            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="timeline">
                    <div className="timeline-step">
                        <div className="timeline-step-number">1</div>
                        <div className="timeline-step-content">
                        <h3>Log Hours</h3>
                        <p>Quickly enter your daily hours and activities using our intuitive form.</p>
                        </div>
                    </div>

                    <div className="timeline-step">
                        <div className="timeline-step-number">2</div>
                        <div className="timeline-step-content">
                        <h3>Submit</h3>
                        <p>Submit your timesheet for approval with one click.</p>
                        </div>
                    </div>

                    <div className="timeline-step">
                        <div className="timeline-step-number">3</div>
                        <div className="timeline-step-content">
                        <h3>Get Approved</h3>
                        <p>Managers review and approve, streamlining your workflow.</p>
                        </div>
                    </div>
                </div>

            </section>


        </div>
        </>
    );
}
