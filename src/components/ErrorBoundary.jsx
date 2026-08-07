import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false });
  };

  goHome = () => {
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error" role="alert" aria-live="assertive">
          <div className="app-error__card">
            <img
              src="/assets/brand/fakhri-logo-180.png"
              width="90"
              height="90"
              alt=""
              aria-hidden="true"
            />
            <p className="eyebrow">Fakhri Mart</p>
            <h1>We hit a small snag.</h1>
            <p>
              The store could not finish loading this view. Your saved products and enquiry list are kept on this device, so you can safely try again.
            </p>
            <div className="app-error__actions">
              <button className="btn btn-primary" type="button" onClick={this.retry}>
                Try again
              </button>
              <button className="btn btn-outline" type="button" onClick={this.goHome}>
                Reload home
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
