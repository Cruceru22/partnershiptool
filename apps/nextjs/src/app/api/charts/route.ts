import { NextResponse } from "next/server";
import { auth } from "@acme/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const sessionData = await auth.api.getSession({
      headers: headers() as unknown as Headers,
    });

    if (!sessionData?.user?.id || !sessionData?.session?.activeOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, options, data } = await request.json();

    // Return a mock success response for now
    return NextResponse.json({
      id: crypto.randomUUID(),
      title,
      options,
      data,
      createdById: sessionData.user.id,
      workspaceId: sessionData.session.activeOrganizationId,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to create chart:", error);
    return NextResponse.json(
      { error: "Failed to create chart" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const sessionData = await auth.api.getSession({
      headers: headers() as unknown as Headers,
    });
    
    if (!sessionData?.user?.id || !sessionData?.session?.activeOrganizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock data for now
    const mockCharts = [
      {
        id: "chart1",
        title: "Monthly Sales",
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: "Monthly Sales" },
          },
        },
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [{
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          }],
        },
        createdById: sessionData.user.id,
        workspaceId: sessionData.session.activeOrganizationId,
        createdAt: new Date().toISOString(),
      }
    ];

    return NextResponse.json(mockCharts);
  } catch (error) {
    console.error("Failed to fetch charts:", error);
    return NextResponse.json(
      { error: "Failed to fetch charts" },
      { status: 500 }
    );
  }
} 