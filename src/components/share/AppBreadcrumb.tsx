import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import useUser from "@/store/useUser";
import { useLocation, Link } from "react-router-dom";

export function AppBreadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean); 
  const { user } = useUser();

  const homePath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "ustadz"
      ? "/ustadz"
      : user?.role === "ortu"
      ? "/ortu"
      : "/";

  // const hiddenSegments = ["detail", "add", "edit"]; 
  const hiddenSegments = ["edit"]; 
  const filteredPaths = paths.filter(
    (segment) => !hiddenSegments.includes(segment) && isNaN(Number(segment))
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={homePath}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {filteredPaths.map((segment, idx) => {
          const to = "/" + paths.slice(0, idx + 1).join("/");
          const isLast = idx === filteredPaths.length - 1;

          return (
            <span key={to} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <span className="text-muted-foreground capitalize">
                    {segment}
                  </span>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to} className="capitalize">
                      {segment}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
