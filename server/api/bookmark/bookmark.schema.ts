import {
  ApiPaginationQuerystring,
  extendSchemaWithPagination,
} from "../../../types/fastifyHelpers";

// Add
export interface ApiBookmarkAddBody {
  url: string;
  tag: string;
  name?: string;
}

export const apiBookmarkAddBodySchema = {
  type: "object",
  properties: {
    url: {
      type: "string",
    },
    tag: {
      type: "string",
    },
    name: {
      type: "string",
    },
  },
  required: ["url"],
};

// Remove
export interface ApiBookmarkRemoveBody {
	id: number;
}

export const apiBookmarkRemoveBodySchema = {
	type: "object",
  properties: {
    tag: {
      id: "number",
    },
  },
};

// List
export interface ApiBookmarkListQuerystring extends ApiPaginationQuerystring {
  tag?: string;
}

export const apiBookmarkListQuerystringSchema = extendSchemaWithPagination({
  type: "object",
  properties: {
    tag: {
      type: "string",
    },
  },
});

// View
export interface ApiBookmarkViewParams {
	id: number; // TODO: branded Id
}

export const apiBookmarkViewParamsSchema = {
	type: "object",
	properties: {
		id: {
			type: "number"
		}
	},
	required: ["id"]
}