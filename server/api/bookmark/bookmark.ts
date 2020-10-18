import serverEnv from "../../lib/envalid";
import {
  Context,
  defaultPagination,
  RegisterFunctionType,
  UserJwt,
} from "../../../types/fastifyHelpers";
import { prisma } from "../..";
import { authenticate } from "../../lib/context";
import {
  apiBookmarkAddBodySchema,
  ApiBookmarkAddBody,
  ApiBookmarkListQuerystring,
  apiBookmarkListQuerystringSchema,
  ApiBookmarkRemoveBody,
  apiBookmarkRemoveBodySchema,
  ApiBookmarkViewParams,
  apiBookmarkViewParamsSchema,
} from "./bookmark.schema";

const registerBookmarkRoutes: RegisterFunctionType = (server, opts, done) => {
  // -- BOOKMARK
  server.post<{ Body: ApiBookmarkAddBody }>(
    "/add",
    {
      schema: {
        body: apiBookmarkAddBodySchema,
      },
    },
    async (request, reply) => {
      const ctx = await authenticate(request.headers.authorization);
      const bm = await prisma.bookmark.upsert({
        create: {
          url: request.body.url,
          tag: request.body.tag,
          name: request.body.name,
        },
        update: {
          isActive: true,
        },
        where: {
          // TODO: consider semantics of whether we should upsert and make active (but return with
          // incorrect name/tag) or if we should just disallow altogether
          url: request.body.url,
        },
      });

      return reply.send(bm);
    }
  );

  server.post<{ Body: ApiBookmarkRemoveBody }>(
    "/remove",
    {
      schema: {
        body: apiBookmarkRemoveBodySchema,
      },
    },
    async (request, reply) => {
      const ctx = await authenticate(request.headers.authorization);
      const bm = await prisma.bookmark.update({
        where: {
          id: request.body.id,
        },
        data: {
          isActive: false, // TODO: hard delete with CASCADE or better enforceability
        },
      });
      return reply.send(bm);
    }
  );

  // -- VIEWING DATA
  server.get<{ Querystring: ApiBookmarkListQuerystring }>(
    "/list",
    {
      schema: {
        querystring: apiBookmarkListQuerystringSchema,
      },
    },
    async (request, reply) => {
      const ctx = await authenticate(request.headers.authorization);
      const bms = await prisma.bookmark.findMany({
        where: {
          tag: request.query.tag,
          isActive: true,
        },
        take: request.query.take || defaultPagination.take,
        skip: request.query.skip || defaultPagination.skip,
      });
      return reply.send(bms);
    }
  );

  server.get<{ Params: ApiBookmarkViewParams }>(
    "/:id",
    {
      schema: {
        params: apiBookmarkViewParamsSchema,
      },
    },
    async (request, reply) => {
      const ctx = await authenticate(request.headers.authorization);

      // Increment view count then redirect
      const bm = await prisma.bookmark.findOne({
        where: { id: request.params.id },
      });
      if (!bm || !bm.isActive) {
        // FIXME: error handling throughout should be more consistent + actual throw + logging etc.
        return await reply
          .status(400)
          .send(`Cannot find bookmark with id ${request.params.id}`);
      }

      // Since we can't use prisma's upsert because it requires unique keys... and multi-field
      // constraints aren't possible... implement our own upsert for Views!
      const bmView = await prisma.bookmarkViews.findFirst({
        where: { bookmarkId: bm?.id, userId: ctx.user.id },
      });

      // Record stats
      let newBmView;
      if (bmView) {
        newBmView = await prisma.bookmarkViews.update({
          where: { id: bmView.id },
          data: { count: bmView.count + 1 },
        });
      } else {
        newBmView = await prisma.bookmarkViews.create({
          data: {
            user: {
              connect: {
                id: ctx.user.id,
              },
            },
            bookmark: {
              connect: {
                id: bm.id,
              },
            },
            count: 1,
          },
        });
      }

      return reply.redirect(bm.url);
    }
  );

  // global stats: "/stats/list" (optional tag)
  // global stats about bookmark: "/stats/:id"

  // user stats: "/me/stats/list" (optional tag)
  server.get<{ Querystring: ApiBookmarkListQuerystring }>(
    "/me/stats/list",
    {
      schema: {
        querystring: apiBookmarkListQuerystringSchema,
      },
    },
    async (request, reply) => {
      const ctx = await authenticate(request.headers.authorization);

      const bmViews = await prisma.bookmarkViews.findMany({
        where: {
          userId: ctx.user.id,
          bookmark: {
            tag: request.query.tag,
            isActive: true,
          },
        },
        take: request.query.take || defaultPagination.take,
        skip: request.query.skip || defaultPagination.skip,
        orderBy: {
          count: "desc",
        },
        include: {
          bookmark: true,
        },
      });

      return reply.send(bmViews);
    }
  );

  // user stats about bookmark: "me/stats/:id"
  done();
};

export default registerBookmarkRoutes;
