import React, { Component } from 'react';
import EditableMap from '../components/editableMap/EditableMap';
import MyRoute from "./../model/MyRoute";
import { Button, InputGroup, FormControl } from 'react-bootstrap';

import './../css/App.css';


class MapCreation extends Component {

	constructor(props) {
		super(props);
		this.routeName = React.createRef();
		this.routeDescription = React.createRef();
		this.points = React.createRef();
		this.routeManager = props.routeManager;
		this.tempRoute = undefined;
	}

	render() {
		return (
			<div id="routeCreationContainer" className="App-header" style={{ height: "80%" }} >
				<h1>Create your own Route</h1>
				<InputGroup className="mb-3" style={{ width: "50vw" }}>
					<InputGroup.Prepend>
						<InputGroup.Text id="basic-addon1">Route Name</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl
						ref={this.routeName}
						aria-describedby="basic-addon1"
						role='title'
					/>
					<InputGroup.Prepend>
						<InputGroup.Text id="basic-addon1">Route Description</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl
						ref={this.routeDescription}
						aria-describedby="basic-addon1"
						role='description'
					/>
				</InputGroup>
				<EditableMap ref={this.points} role='map' />
				<Button variant="primary" onClick={() => this.uploadToPod()} style={{ margin: "1.5vh" }}>Save route in pod</Button>
				<input id="pictureUploader" type="file" name="file" onChange={this.onChangeHandler} />
			</div>
		);
	}

	createRoute() {
		let name = this.routeName.current.value;
		if (name === '') {
			alert("Name can't be empty");
			return undefined;
		}
		let waypoints = this.points.current.state.points;
		if (waypoints.length < 2) {
			alert("You should have at least two points");
			return undefined;
		}
		let description = this.routeDescription.current.value;
		if (description === '') {
			alert("Description can not be empty");
			return undefined;
		}
		let route = new MyRoute(name, "Temp author", description, waypoints);
		return route;
	}

	checkRouteChanged(newRoute) {
		if ((this.tempRoute === undefined) || (this.tempRoute !== undefined && (this.tempRoute.getComparableString() !== newRoute.getComparableString()))) {
			this.tempRoute = newRoute;
			this.routeManager.addRoute(this.tempRoute);
			return newRoute;
		} else {
			return this.tempRoute;
		}
	}

	async uploadToPod() {
		let route = this.createRoute();
		if (route === undefined) {
			return;
		}
		route = this.checkRouteChanged(route);
		route.uploadToPod((filePodUrl, podResponse) => {
			let alertText = "";
			if (filePodUrl === null) {
				alertText = "We are sorry!! Something went wrong while connecting to your POD";
			} else {
				alertText = "Route updated in your POD";
			}
		});
		alert("Uploading route to SOLID POD");
		window.location.href = "#routes/list";
	}

}

export default MapCreation;
