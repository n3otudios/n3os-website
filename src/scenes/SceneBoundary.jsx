import { Component } from "react";

/**
 * Every 3D scene on this site is decorative. If WebGL is unavailable, the
 * driver is blocklisted, the GPU process dies, or the async scene chunk fails
 * to download, the correct outcome is "the decoration is missing" — never
 * "the page is blank".
 *
 * React unmounts the whole tree on an uncaught render error, so without this
 * boundary a single failing <Canvas> would take the entire page with it.
 */
export default class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.warn("[n3os] scene failed to render, continuing without it:", error);
    }
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
