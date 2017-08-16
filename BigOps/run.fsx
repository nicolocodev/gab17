let Run(queueMsg: string, log: TraceWriter) =
    log.Info(sprintf "F# ServiceBus function processed message: %s" queueMsg)
