import { assertAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import {
  badRequest,
  created,
  ok,
  serverError,
  zodErrorResponse,
} from "@/lib/http";
import { parseArrayParam, parseNumberParam } from "@/lib/query-params";
import { sanitizeStringArray, sanitizeText } from "@/lib/sanitize";
import {
  collegeFilterSchema,
  collegeMutationSchema,
} from "@/lib/validations/college";
import { getCollegeFilterOptions, listColleges, createCollege } from "@/services/college.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = collegeFilterSchema.safeParse({
      search: searchParams.get("search") ? sanitizeText(searchParams.get("search")!) : undefined,
      states: parseArrayParam(searchParams.get("states")),
      locations: parseArrayParam(searchParams.get("locations")),
      ownership: parseArrayParam(searchParams.get("ownership")),
      minFees: parseNumberParam(searchParams.get("minFees")),
      maxFees: parseNumberParam(searchParams.get("maxFees")),
      minRating: parseNumberParam(searchParams.get("minRating")),
      courses: parseArrayParam(searchParams.get("courses")),
      sortBy: searchParams.get("sortBy") ?? undefined,
      page: parseNumberParam(searchParams.get("page"), 1),
      limit: parseNumberParam(searchParams.get("limit"), 20),
    });

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const session = await auth();
    const [result, filterOptions] = await Promise.all([
      listColleges(parsed.data, session?.user?.id),
      getCollegeFilterOptions(),
    ]);

    return ok({
      ...result,
      filters: {
        ...filterOptions,
        selected: {
          ...parsed.data,
          states: sanitizeStringArray(parsed.data.states),
          locations: sanitizeStringArray(parsed.data.locations),
          courses: sanitizeStringArray(parsed.data.courses),
        },
      },
    });
  } catch (error) {
    console.error("GET /api/colleges failed", error);
    return serverError();
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const adminError = assertAdmin(session);

    if (adminError) {
      return adminError;
    }

    const body = await request.json();
    const parsed = collegeMutationSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const college = await createCollege({
      ...parsed.data,
      description: sanitizeText(parsed.data.description),
      topRecruiters: sanitizeStringArray(parsed.data.topRecruiters),
    });

    return created({
      message: "College created successfully",
      college,
    });
  } catch (error) {
    console.error("POST /api/colleges failed", error);
    return badRequest("Unable to create college");
  }
}
