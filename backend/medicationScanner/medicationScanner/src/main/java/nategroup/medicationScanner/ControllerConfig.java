package nategroup.medicationScanner;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@ControllerAdvice
public class ControllerConfig implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    @ResponseBody
    public ResponseEntity<Object> beforeBodyWrite(Object body,
                                                  MethodParameter returnType,
                                                  MediaType selectedContentType,
                                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                                  ServerHttpRequest request,
                                                  ServerHttpResponse response) {
        if (body == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(body);
    }
}
