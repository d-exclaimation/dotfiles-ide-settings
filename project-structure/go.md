# Project structure for Go

There are existing standards that uses `/vendor`, `/internals`, `/cmd`, etc. Personally, I find this less helpful after the introduction of go modules. They don't meant much in medium to even larger projects. Only until a certain threshold where this make some sense but idk I may just be a complete noob.

## Small
No reason for using nested directories

```go
- /project
    - go.mod
    - go.sum
    - main.go
    - *.go
```

## Medium (This is the common one) | Inheritance
For medium projects, I like using nested directories to give better clarification on why certain things exist. Also, this absolutely avoid circular imports

go modules handle the outside dependecies, I don't need a vendor to be bundled here. I also does not put main.go in cmd since it's just one file

```go
- /project
    - go.mod
    - go.sum
    - main.go
    - /api
        - server.go
        - routes.go
        - generate.go
        - *.go
        - /middlewares
            - middleware.go
        - /something
            - service.go
            - model.go
        - /something-else
            - service.go
            - model.go
    - /database
        - client.go
        - /schema
            - entity.go
        - generate.go
        - *.go
    - /utils
        - utils_log.go
        - utils_conversion.go
        - utils_*.go
    ...
```

## Large (rare)

Idk, when a project or something gets this big, this should be discussed with other team members. If I were to have a massive project that I still am the only person in the team, then I'll probably still use the medium solution, but add some extra things
