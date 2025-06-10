export default eventHandler(async (event) => {
  const {user} = await getUserSession(event);

  if (user?.technician) {
    const selected = await useDrizzle().query.jobs.findMany({
      columns: {
        id: true,
        additionalInfo: true,
      },
      where: (jobs, {exists, and, eq}) =>
        exists(
          useDrizzle()
            .select()
            .from(tables.jobServices)
            .where(
              and(
                eq(tables.jobServices.jobId, jobs.id),
                eq(tables.jobServices.technicianId, user.technician!.id)
              )
            )
        ),
      with: {
        case: {
          columns: {code: true},
          with: {
            client: {
              columns: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
                company: true,
              },
            },
          },
        },
        jobServices: {
          columns: {
            id: true,
            serviceId: true,
            status: true,
            quantity: true,
          },
          where: (jobServices, {eq}) =>
            eq(tables.jobServices.technicianId, user.technician!.id),
          with: {
            technician: {columns: {firstName: true, lastName: true}},
            service: {columns: {name: true}},
            jobProducts: {
              columns: {productId: true, quantity: true},
              with: {product: {columns: {name: true}}},
            },
          },
        },
      },
    });

    return selected;
  } else {
    const selected = await useDrizzle().query.jobs.findMany({
      columns: {
        id: true,
        additionalInfo: true,
      },
      with: {
        case: {
          columns: {
            code: true,
          },
          with: {
            client: {
              columns: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
                company: true,
              },
            },
          },
        },
        jobServices: {
          columns: {
            serviceId: true,
            status: true,
            quantity: true,
          },
          with: {
            technician: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
            service: {
              columns: {
                name: true,
              },
            },
            jobProducts: {
              columns: {
                productId: true,
                quantity: true,
              },
              with: {
                product: {
                  columns: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return selected;
  }
});
