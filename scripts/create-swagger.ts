import { execSync } from 'child_process';
import { Command, Option } from 'commander';
import { readFileSync, writeFile } from 'fs';
import { join } from 'path';

const program = new Command();

const buildImportPath = (filename: string): `@src/${string}/${string}.ts` => {
  return ('@src/' +
    filename.replace('./src/', '')) as `@src/${string}/${string}.ts`;
};

const getBaseImport = (): string => {
  return `import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ERROR_CODE } from '@src/constants/error-response-code.constant';
import { ApiBaseResponse } from '@src/decorators/api-base-response.decorator';
import { ApiFailureResponse } from '@src/decorators/api-failure-response.decorator';
import { ApiPaginationResponse } from '@src/decorators/api-pagination-response.decorator';\n`;
};

const getSwaggerMethodName = (methodName: string): string => {
  return 'Api' + methodName.slice(0, 1).toUpperCase() + methodName.slice(1);
};

const getSwaggerFormat = (methodName: string): string => {
  return `export const ${methodName} = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBaseResponse(HttpStatus.OK, {}),
    ApiFailureResponse(HttpStatus.BAD_REQUEST, [ERROR_CODE]),
    ApiFailureResponse(HttpStatus.INTERNAL_SERVER_ERROR, [ERROR_CODE]),
  );
};
`;
};

program
  .description(`컨트롤러 기준으로 controller.swagger.ts 를 생성합니다.`)
  .requiredOption('-n, --name <name>', 'controller name')

  .addOption(
    new Option(
      '-i, --init <init>',
      'swagger.ts 파일을 초기화 할지 여부입니다. 이미 파일이 존재한다면 덮어씁니다.',
    ).default(false, '초기화 안함'),
  )
  .parse();

const options = program.opts<{ name: unknown; init: any }>();

(function createSwagger(): void {
  const { name, init } = options;

  if (typeof name !== 'string') {
    console.error('name 은 string 형태여야합니다.');
    return;
  }

  const swaggerFileName = `${name}.swagger.ts`;
  const ctrlFileName = `${name}.controller.ts`;
  const ctrlFilePath = execSync(`find . -name "${ctrlFileName}"`, {
    encoding: 'utf-8',
  })
    .replace('\n', '')
    .replace(ctrlFileName, '');

  if (!ctrlFilePath) {
    console.error(`${name}.controller.ts 파일은 존재하지 않습니다.`);
    return;
  }
  const rootDir: string[] = __dirname.split('/');
  rootDir.pop();

  const controller: string = JSON.parse(
    JSON.stringify(
      readFileSync(
        join(rootDir.join('/'), ctrlFilePath, ctrlFileName),
        'utf-8',
      ),
    ),
  );

  const controllerMethodNames =
    controller
      .match(/^(  [a-z].{0,})/gm)
      ?.map((el) => {
        return el.replace(/ /g, '').split('(')[0];
      })
      .filter((el) => {
        return !/(constructor|implement)/.test(el);
      })
      .map((el) => {
        return el.replace('async', '');
      }) || [];

  const toCreateFunction: Record<string, string | undefined> = {};
  controllerMethodNames.forEach((controllerMethodName) => {
    toCreateFunction[getSwaggerMethodName(controllerMethodName)] = undefined;
  });

  const createMethodNames: string[] = [];
  let description = '';
  let swaggerFile = '';

  try {
    swaggerFile = readFileSync(join(ctrlFilePath, swaggerFileName), 'utf-8');
  } catch (e) {}

  if (!swaggerFile || init) {
    description += getBaseImport();

    controllerMethodNames.forEach((methodName) => {
      const swaggerFunctionName = getSwaggerMethodName(methodName);

      description += '\n' + getSwaggerFormat(swaggerFunctionName);
      createMethodNames.push(swaggerFunctionName);
    });
  } else {
    const existSwaggerFunction: Record<string, string> = {};

    swaggerFile.split('export const').forEach((el, idx) => {
      if (idx === 0) {
        el = el.slice(0, -1);
        description = el;

        return;
      }

      el = el
        .split('\n')
        .map((e) => {
          return e.trim();
        })
        .filter((e) => {
          return e;
        })
        .join('\n');

      const functionName = el.split('=')[0].trim();

      existSwaggerFunction[functionName] = 'export const' + ' ' + el;
    });

    for (const toCreateFunctionName in toCreateFunction) {
      if (existSwaggerFunction[toCreateFunctionName]) {
        toCreateFunction[toCreateFunctionName] =
          existSwaggerFunction[toCreateFunctionName];
      } else {
        toCreateFunction[toCreateFunctionName] =
          getSwaggerFormat(toCreateFunctionName);
        createMethodNames.push(toCreateFunctionName);
      }
    }

    for (const toCreateFunctionName in toCreateFunction) {
      description += '\n' + toCreateFunction[toCreateFunctionName] + '\n';
    }
  }

  writeFile(join(ctrlFilePath, swaggerFileName), description, (err) => {
    if (err) {
      console.error(err);
    } else {
      if (swaggerFile) {
        console.log('file:', join(ctrlFilePath, swaggerFileName));
        console.log('created method:', createMethodNames);
        execSync(`prettier --write "${join(ctrlFilePath, swaggerFileName)}"`);
      } else {
        console.log('created file:', join(ctrlFilePath, swaggerFileName));
        console.log('created method:', createMethodNames);
      }
    }
  });
})();
