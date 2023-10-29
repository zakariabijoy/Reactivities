namespace Application.Core;

public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T Value { get; set; }
    public string Error { get; set; }

    public static Result <T> Success(T Value) => new Result<T>{IsSuccess = true, Value = Value};
    public static Result <T> Failure(string Error) => new Result<T>{IsSuccess = false, Error = Error};
}