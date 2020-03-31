import { v4 as uuid } from "uuid";
import RouteWaypoint from "./RouteWaypoint";

/**
 * Returns an Array<RouteWaypoint> that represent the same set of points 
 * received as a parameter.
 * @param {Array<{lat:"", lng:""}>} waypoints The list of waypoints to 
 * transform.
 */
function processPoints(waypoints) {
	let list = [];
	waypoints.forEach((point) => list.push(new RouteWaypoint(point.lat, point.lng)));
	return list;
}

class MyRoute {

	/**
	 * Constructor for new Route objects. Will be represented by an id 
	 * (uuid generation), an array of RouteWaypoint objects holding latitude, 
	 * longitude and altitude, a name, an author and a description.
	 * 
	 * @param {String} name The name of the route.
	 * @param {String} author The creator of the route.
	 * @param {String} description A description of the route.
 	 * @param {Array<{lat:"", lng:""}>} points The list of waypoints of this rule.
	 */
	constructor(name, author, description, waypoints) {
		this.id = uuid().toString();
		this.name = name;
		this.author = author;
		this.description = description;
		this.waypoints = processPoints(waypoints);
	}

	getId() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	getAuthor() {
		return this.author;
	}

	getDescription() {
		return this.description;
	}

	getWaypoints() {
		return this.waypoints;
	}

	getFileName() {
		return this.name + "_" + this.id + ".json";
	}

	getComparableString() {
		let parsedRoute = JSON.parse(this.toJsonLd());
		parsedRoute["@context"] = "";
		parsedRoute["id"] = "";
		return JSON.stringify(parsedRoute);
	}

	modifyFromJsonLd(stringData) {
		let parsedRoute = JSON.parse(stringData);
		this.id = parsedRoute["id"];
		this.name = parsedRoute["name"];
		this.author = parsedRoute["author"];
		this.description = parsedRoute["description"];
		let rawPoints = parsedRoute["points"];
		rawPoints = rawPoints.map((jsonPoint) => {
			return {
				lat: jsonPoint["latitude"],
				lng: jsonPoint["longitude"]
			};
		});
		this.waypoints = processPoints(rawPoints);
	}

	toJsonLd() {
		let poinstInJson = [];
		this.waypoints.forEach((point) => poinstInJson.push(point.toJson()));
		return JSON.stringify(
			{
				"@context": {
					"@version": 1.1,
					"comments": {
						"@container": "@list",
						"@id": "viade:comments"
					},
					"description": {
						"@id": "schema:description",
						"@type": "xs:string"
					},
					"media": {
						"@container": "@list",
						"@id": "viade:media"
					},
					"name": {
						"@id": "schema:name",
						"@type": "xs:string"
					},
					"points": {
						"@container": "@list",
						"@id": "viade:points"
					},
					"latitude": {
						"@id": "schema:latitude",
						"@type": "xs:double"
					},
					"longitude": {
						"@id": "schema:longitude",
						"@type": "xs:double"
					},
					"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
					"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
					"schema": "http://schema.org/",
					"viade": "http://arquisoft.github.io/viadeSpec/",
					"xsd": "http://www.w3.org/2001/XMLSchema#"
				},
				"comments": [],
				"media": [],
				"id": this.id,
				"name": this.name,
				"author": this.author,
				"description": this.description,
				"points": poinstInJson
			}
		);
	}

}

export default MyRoute;